let signupForm=document.getElementById("signupForm");
let domain="http://13.232.126.113";

signupForm.addEventListener("submit",async(e)=>{
    e.preventDefault();
    
    let formData=new FormData(e.target);
    let formObj=Object.fromEntries(formData.entries());
    let err=document.getElementById("error");
    try {
       let respond= await axios.post(`${domain}:4000/user/signup`,formObj);
       
       if(!respond.data.success){
          setInterval(()=>{
             err.textContent=respond.data.message;
          },2000)
       }
       if(respond.data.success){
         sessionStorage.setItem("token",respond.data.message);
         sessionStorage.setItem("name",respond.data.name);
          window.location.href=`${domain}/`;
       }
       
       
    } catch (error) {
        
        err.textContent=error.message;
    }
})
