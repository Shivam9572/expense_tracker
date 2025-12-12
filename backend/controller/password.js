const { sendInBlue } = require("../services/sendInBlue");
const User = require("../models/users");
const RessetLink = require("../models/ressetLink");

const StatusCodes = require('http-status-codes').StatusCodes;
require("dotenv").config();



const bcrypt = require("bcrypt");
const sequelize = require("../utilits/databaseConnection");

module.exports.forgetPassword = async (req, res) => {
  try {
    let email = req.body.email;
    let user = await User.findOne({ where: { email: email } });
    if (!user) {
      res.send({ "message": "email does not exits" });
      return;
    }
    const { v4: uuidv4, stringify } = await import("uuid");
    const myUuid = uuidv4().toString();
    let result = await sendInBlue(req.body.email, myUuid);
    if (result) {


       await RessetLink.create({ id: myUuid, user_id: user.toJSON().id });

      res.status(StatusCodes.OK).send({ "success": "successful sent link on your email" });
      return;
    }

    else {
      res.status(StatusCodes.SERVICE_UNAVAILABLE).send({ "response": "something went worng" });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("something went wrong");
  }
}
module.exports.ressetPasswprd = async (req, res) => {

  try {
    let id = req.params.id;

    let { password, cpassword } = req.body;
    if (password != cpassword) {
      res.status(StatusCodes.FORBIDDEN).send({ "failed": "password doed not match confirm password" });
      return;
    };


    let hash = await bcrypt.hash(password, 10);


    const t = await sequelize.transaction();
    let result = await RessetLink.findOne({ where: { id: id } });
    if(!result){
      throw new Error("link does not send");
    }
    result = await User.update({ password: hash }, { where: { id: result.toJSON().user_id } }, { transaction: t });
    if (!result) {
      throw new Error("error in updation of password");
    }
    result = await RessetLink.destroy({ where: { id: id } }, { transaction: t });


    res.status(StatusCodes.OK).send({ "success": "successful resset password" });
    t.commit();
    return;

  } catch (error) {
    t.rollback();
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ "failed": "something went wrong" });
  }
}

module.exports.checkLink = async (req, res) => {
  let uuid = req.params.id;
  try {
    let result = await RessetLink.findByPk(uuid);
    if (result) {
      res.redirect(`${process.env.F_DOMAIN}/password/resset/?token=${result.toJSON().id}`);
    } else {
      res.status(StatusCodes.NO_CONTENT).send("Link has been expired");
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("something went wrong");
  }
}