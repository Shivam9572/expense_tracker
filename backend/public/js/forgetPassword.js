
let form=document.getElementById("form");
form.addEventListener("submit",async(e)=>{
    e.preventDefault();
    
    
  let err=document.getElementById("error");
    try {
        let email=document.getElementById("email").value;
       let respond= await axios.post(`api/password/forget`,{email:email});
     
       if(!respond.data.success){
         
          err.textContent=respond.data.message;
       }
       if(respond.data.success){
         
          
          window.location.href=`/login`;
       }
       
       
    } catch (error) {
        
        err.textContent=error.message;
    }
})
