require("dotenv").config();
const SibApiSdk = require("sib-api-v3-sdk");
const jwt=require("jsonwebtoken");

module.exports.sendInBlue = async (receiverEmail,uuid)=>{
    try {
        
        const client = SibApiSdk.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;
        const tranEmailApi = new SibApiSdk.TransactionalEmailsApi();
        const sender = {
            email: "expensetracker688@gmail.com",
            name:"expense tracker"
        };
        const receivers = [
            {
                email:receiverEmail
            }
        ];
        let href=`${process.env.DOMAIN}/api/password/resset/${uuid}`;
        let result=await tranEmailApi.sendTransacEmail({
            sender,
            to:receivers,
            subject:"resset the password",
            textContent:"click on link and resset your password",
            htmlContent:`<h1>click below link<h1>
            <a href=${href}>click on here</a>`
        });
        
        return result;

    } catch (error) {
        console.log(error);

    }
}