
const Expense=require("./expense");
const Users = require("./users");
const Transaction=require("./transaction");
const Subcription=require("./subscription");
const RessetLink=require("./ressetLink");
const Report=require("./report");

Users.hasMany(Expense, { foreignKey: 'userid', as:"expenses",onDelete: 'CASCADE', hooks: true }); 
Expense.belongsTo(Users, { foreignKey: 'userid' });
Subcription.belongsTo(Transaction,{foreignKey:"order_id"});
Subcription.belongsTo(Users,{foreignKey:"user_id"});
Users.hasMany(Transaction,{foreignKey:"user_id",onDelete: 'CASCADE', hooks: true});
Transaction.belongsTo(Users,{foreignKey:"user_id"});
RessetLink.belongsTo(Users,{foreignKey:"user_id"});
Users.hasMany(RessetLink,{foreignKey:"user_id"});

Users.hasMany(Report,{foreignKey:"user_id",as:"report"});
Report.belongsTo(Users,{foreignKey:"user_id",as:"user"});


module.exports={Users,Expense,Transaction,Subcription,RessetLink,Report};
