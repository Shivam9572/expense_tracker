const userModel = require("../models/users");
const Subcription = require("../models/subscription");
const Expense = require("../models/expense");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Json } = require("sequelize/lib/utils");
const Report = require("../models/report");
const { Op } = require("sequelize");
require("dotenv").config();



module.exports.signup = async (req, res) => {

    let { name, email, password, cpassword } = req.body;
    if (!email || !name || !password || !cpassword) {
        res.send({ success: false, message: "all fields are requiered" });
        return;
    }
    try {
        let user = await userModel.findByPk(email);
        if (user) {
            res.send({ success: false, message: `${email} already exits` });
            return;
        }
        if (password != cpassword) {
            res.send({ success: false, message: `password does not match with confirm password` });
            return;
        }
        let hash = await bcrypt.hash(password, 10);
        let newUser = await userModel.create({ name: name, email: email, password: hash });
        newUser = newUser.toJSON();
        let token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET_KEY);

        res.send({ success: true, message: token, name: newUser.name });


    } catch (error) {
        console.log(error);
        res.status(404).send({ "failed": error.message });
    }
}
module.exports.isPremium = async (req, res) => {
    try {
        let result = await Subcription.findOne({ where: { user_id: req.userId } });
        if (result) {
            res.json({ isPremium: true });
            return;
        }
        res.json({ isPremium: false });
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
}

module.exports.login = async (req, res) => {

    let { email, password } = req.body;
    if (!email || !password) {
        res.status(404).json({ success: false, messsage: "all fields are requiered" });
        return;
    }
    try {
        let user = await userModel.findOne({ where: { email: email } });
        if (!user) {
            res.status(400).json({ success: false, failed: `${email} does not exits` });
            return;
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                throw new Error("bcrypt error");
            }
            if (result) {
                user = user.toJSON();
                let token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);

                res.send({ success: true, message: token, name: user.name });
            } else {
                res.send({ success: false, message: "please enter correct password" });
            }
        })


    } catch (error) {
        console.log(error);
        res.status(404).send({ error: error.message });
    }
}

const upload = async (data, fileName) => {
    try {
        const s3Client = new S3Client({
            region: "ap-southeast-2",       // replace with your region
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
        let awsResponse = await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileName,
                Body: data,
                ACL: "public-read"
            }),
        );

        return JSON.stringify(awsResponse);

    } catch (error) {
        console.log(error);
        return error;
    }
}
module.exports.generateReport = async (req, res) => {


    try {
        let { year, month } = req.query;

        let startDate;
        let endDate;
        if (month == "all") {

            startDate = new Date(`${year}-01-01 00:00:00`);
            endDate = new Date(`${year}-12-31 23:59:59`);

        } else {
            const months = {
                January: 1,
                February: 2,
                March: 3,
                April: 4,
                May: 5,
                June: 6,
                July: 7,
                August: 8,
                September: 9,
                October: 10,
                November: 11,
                December: 12
            };

            startDate = new Date(`${year}-${months[month]}-01 00:00:00`);
            endDate = new Date(`${year}-${months[month]}-31 23:59:59`);
        }
        let allExpenses = await Expense.findAll({ attributes: [["amount", "expense"], "description", "category", ["createdAt", "date"]], where: { createdAt: { [Op.between]: [startDate, endDate] }, userid: req.userId } });
        let allExpensesString = JSON.stringify(allExpenses, null, 2);
        allExpenses = JSON.parse(allExpensesString);
        if (allExpenses.length == 0) {
            res.status(200).json({ message: "Expenses are not available ", success: false });
            return;
        }

        let data = {
            [year]: {

            }
        };
        function toIST(date) {
            
            return new Date(date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
        }
        
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let preDate = toIST(allExpenses[0].date);
        let preMonth = months[preDate.getMonth()];
        let aDay = [];
        let aMonth = [];


        allExpenses.forEach(element => {

            const istTimestamp = toIST(element.date);
            element.date = `${istTimestamp.getFullYear()} ${istTimestamp.toLocaleString("en-IN", { month: "short" })} ${istTimestamp.getDate()}`;
           
            let month = months[istTimestamp.getMonth()];
            if (!data[year][month]) {
                data[year][month] = [];
            }
            if (preDate.getDate() == istTimestamp.getDate()) {

                aDay.push(element);
                return;
            } else {

                aMonth.push(aDay);
                preDate = istTimestamp;
                aDay = [];
                aDay.push(element);

            }
            if (preMonth != month) {
                data[year][month] = aMonth;
                aMonth = [];
                preMonth = month;
            }




        });

        aMonth.push(aDay);
        data[year][preMonth] = aMonth;
         data=JSON.stringify(data);
        
        let url = await upload(data, `${req.userId}/${year}-${month}.txt`);
        if (!url) {
            throw new Error("uload error on s3 AWS");
        }
        url = `https://${process.env.AWS_BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com/${req.userId}/${year}-${month}.txt`;
        let isExits = await Report.findOne({ where: { [Op.and]: [{ "year": year }, { "month": month }, { "user_id": req.userId }] } });
        if (!isExits) {

            await Report.create({ "url": url, "year": year, "month": month, "user_id": req.userId });
        }


        res.status(200).json({ "message": url, "success": true });



    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": "something went wrong", "success": false });
    }

}
module.exports.downloaded = async (req, res) => {

    try {
        let result=await Report.findAll({where:{"user_id":req.userId},attributes:["url","year","month"]});

        res.status(200).json({message:result,success:true});

    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": "something went wrong", "success": false });
    }

}


