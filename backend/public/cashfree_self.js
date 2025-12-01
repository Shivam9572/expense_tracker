const cashfree = Cashfree({
    mode: "sandbox",
});
document.getElementById("renderBtn").addEventListener("click", async () => {
    try {
        let result = await axios.post("http://localhost/payment/pay");
        const sessionId = await result.json().sessionId;
        let checkoutOptions = {
            paymentSessionId: sessionId,
            redirectTarget: "_self",
        };
        await cashfree.checkout(checkoutOptions);

    } catch (error) {
        console.log(error.message);

    }

});