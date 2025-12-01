const { Cashfree, CFEnvironment } = require("cashfree-pg");
const Transaction = require("../models/transaction");
require("dotenv").config();


const cashfree = new Cashfree(CFEnvironment.SANDBOX,process.env.CASHFREE_API_KEY , process.env.CASHFREE_SCRET_KEY);
const createOrder = async (userId, amount, phone) => {
    try {
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
        const formmatedExpiryDate = expiryDate.toISOString();
        const { v4: uuidv4, stringify } = await import("uuid");

        const myUuid = uuidv4().toString();
        const request = {
            "order_amount": amount,
            "order_currency": "INR",
            "order_id": myUuid,
            "customer_details": {
                "customer_name": "shivam kumar",
                "customer_id": userId.toString(),
                "customer_phone": "9876543210",

            },
            "order_meta": {
                "return_url": `${process.env.B_DOMAIN}/payment/payment-status?order_id=` + myUuid,
                "payment_methods": "cc,dc,upi"
            },
       
        "order_expiry_time": formmatedExpiryDate
        };

        let sessionId;
        let response = await cashfree.PGCreateOrder(request);


        await Transaction.create({
            order_id: response.data.order_id,
            customer_name: response.data.customer_details.customer_name, user_id: response.data.customer_details.customer_id,
            amount: response.data.order_amount, phone: response.data.customer_details.customer_phone, user_id: userId
        });
        sessionId = response.data.payment_session_id;



        return sessionId;

    } catch (err) {
        console.log(err);
        throw new Error("create order error");
    }
}
const getPaymentStatus = async (orderId) => {

    try {


        let getOrderResponse = [];
        getOrderResponse = await cashfree.PGOrderFetchPayments(orderId);
        getOrderResponse = getOrderResponse.data//Get Order API Response
        let orderStatus;

        if (getOrderResponse.filter(transaction => transaction.payment_status === "SUCCESS").length > 0) {


            orderStatus = "Success";
        } else if (getOrderResponse.filter(transaction => transaction.payment_status === "PENDING").length > 0) {
            orderStatus = "Pending";
        } else {
            orderStatus = "Failure";
        }
        return orderStatus;
    } catch (error) {
        console.log("error->" + error.message);

    }
}
module.exports = { getPaymentStatus, createOrder };
