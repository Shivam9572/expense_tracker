let signupForm=document.getElementById("signupForm");


signupForm.addEventListener("submit",async(e)=>{
    e.preventDefault();
    
    let formData=new FormData(e.target);
    let formObj=Object.fromEntries(formData.entries());
    let err=document.getElementById("error");
    try {
       let respond= await axios.post(`/api/user/signup`,formObj);
       
       if(!respond.data.success){
          setInterval(()=>{
             err.textContent=respond.data.message;
          },2000)
       }
       if(respond.data.success){
         sessionStorage.setItem("token",respond.data.message);
         sessionStorage.setItem("name",respond.data.name);
          window.location.href=`/`;
       }
       
       
    } catch (error) {
        
        err.textContent=error.message;
    }
})
