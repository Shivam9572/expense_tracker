require("dotenv").config();

const Subcription = require("../models/subscription");
const Transaction = require("../models/transaction");
const { createOrder, getPaymentStatus } = require("../services/cashfreeservice");
const seqelize = require("../utilits/databaseConnection");

module.exports.order = async (req, res) => {
  try {
    const sessionId = await createOrder(req.userId, 100, 8092398249);
   
    if (!sessionId) {
      res.send("error->session Id");
      return;
    }
    res.json({ sessionId: sessionId });
  } catch (error) {
    console.log(error);
    res.send("error");
  }
}
module.exports.orderStatus = async (req, res) => {
  const t=await seqelize.transaction();
  try {
    const orderId = req.query.order_id;
    const status = await getPaymentStatus(orderId);
    console.log(status);
    if (status == "Success") {
      let order = await Transaction.findByPk(orderId);
      await Transaction.update({ status: "success" }, {
        where: {
          order_id: orderId
        },transaction:t
      });
      order = order.toJSON();
      await Subcription.create({ amount: order.amount, order_id: order.order_id, user_id: order.user_id },{transaction:t});

    }
    if (status == "Pending") {
     
      await Transaction.update({ status: "pending" }, {
        where: {
          order_id: orderId
        },
        transaction:t
      });

    }
    if (status == "Failure") {
      
      await Transaction.update({ status: "failure" }, {
        where: {
          order_id: orderId
        },transaction:t
      });

    }
    res.redirect(`${process.env.F_DOMAIN}?alertMessage=${status}`);

  } catch (error) {
    await t.rollback();
    console.log(error);
    res.send("error");
  }
}