

const Expense = require("../models/expense");
const User = require("../models/users");
const sequelize = require("../utilits/databaseConnection");





module.exports.addExpense = async (req, res) => {

    let { amount, description, category } = req.body;
    if (!amount || !description || !category) {
        res.json({ success: false, message: "allfields must be required" });
        return;
    }
      const t=await sequelize.transaction();
    try {
        
        let result = await Expense.create({ amount: amount, description: description, category: category, userid: req.userId },{transaction:t});
        let user=await User.findByPk(req.userId);
        await user.increment("total_amount",{by:amount,transaction:t});

          await t.commit()
        res.send(result);

    } catch (error) {
      await t.rollback();
        res.status(500).send(error.message);
    }

}
module.exports.getExpense = async (req, res) => {

    try {
        let page=req.query.page;
        let lim=req.query.limit || 10;
       page= parseInt(page);
       lim= parseInt(lim);
     
        if(page!=null){
            
          let result = await Expense.findAll({ where: { userid: req.userId }, attributes: ["id", "amount", "description", "category"],offset:page*lim,limit:lim });
          let nextExpense=await Expense.findAll({ where: { userid: req.userId }, attributes: ["id", "amount", "description", "category"],offset:((page*lim)+lim),limit:lim });
          
          if(nextExpense.length>0){
          res.json({expense:result,nextPage:true});
          }
          else{
             res.json({expense:result,nextPage:false});
          }
           return;
        }
        let result = await Expense.findAll({ where: { userid: req.userId }, attributes: ["id", "amount", "description", "category"] });
        res.json({expense:result});
        
       
    } catch (error) {
        console.log(error);

        res.send(error.message);
    }
}
module.exports.deleteExpense = async (req, res) => {
    let id = req.params.id;
    const t=await seqelize.transaction();
    try {
       
        let result = await Expense.findByPk(id);
        
        if (!result) {
            res.send({ success: false, message: "expense does not exit" });
            return;
        }
        
        result=result.toJSON();
        
         result=await User.decrement("total_amount",{ by:result.amount ,where:{id:result.userid},transaction:t});
        
        await Expense.destroy({ where: { id: id } ,transaction:t});
        await t.commit();
        res.send({ success: true, message: "expense is deleted" });
    } catch (error) {
        await t.rollback();
        res.send(error.message);
    }
}
