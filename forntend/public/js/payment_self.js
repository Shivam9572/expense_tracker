 const cashfree = Cashfree({
            mode: "sandbox",
        });
     
         
        document.getElementById("renderBtn").addEventListener("click", async () => {
            const url = `/api/payment/order`;


            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');
                if (!token) {
                    console.log("token not access to url");
                    return;
                }
                
                const response = await axios.post(url, {},{
                    headers: {
                        authorization: token
                    }
                });
                 if(response.data.sessionId){
                    console.log(response.data.sessionId);
                    
                 }
                
                let checkoutOptions = {
                    paymentSessionId:response.data.sessionId,
                    redirectTarget: "_self",
                };
                await cashfree.checkout(checkoutOptions);
                
            } catch (error) {
                console.log("checkout=>"+error);

            }

        });
