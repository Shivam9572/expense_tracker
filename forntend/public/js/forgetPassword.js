let domain="http://13.232.126.113";
let form=document.getElementById("form");
form.addEventListener("submit",async(e)=>{
    e.preventDefault();
    
    
  let err=document.getElementById("error");
    try {
        let email=document.getElementById("email").value;
       let respond= await axios.post(`${domain}:4000/password/forget`,{email:email});
     
       if(!respond.data.success){
         
          err.textContent=respond.data.message;
       }
       if(respond.data.success){
         
          
          window.location.href=`${domain}:3000/login`;
       }
       
       
    } catch (error) {
        
        err.textContent=error.message;
    }
})
