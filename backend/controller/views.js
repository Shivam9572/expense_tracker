const path = require("path");


module.exports.getIndexPage=(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'../public/views/index.html'));
}
module.exports.loginPage=(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'../public/views/login.html'));
}
module.exports.signupPage=(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'../public/views/signup.html'));
}
module.exports.forgetPasswordPage=(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'../public/views/forgetPassword.html'));
}
module.exports.resetPasswordPage=(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'../public/views/resset.html'));
}
module.exports.paymentPage=(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'../public/views/paymentPage.html'));
}

