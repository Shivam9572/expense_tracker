if(sessionStorage.getItem("token")){
   window.location.href="views/";
}
let loginForm = document.getElementById("loginForm");
const urlParams = new URLSearchParams(window.location.search);
const alertMessage = urlParams.get('alertMessage');
if (alertMessage) {
   alert(alertMessage);
}


loginForm.addEventListener("submit", async (e) => {
   e.preventDefault();

   let formData = new FormData(e.target);
   let formObj = Object.fromEntries(formData.entries());
   let err = document.getElementById("error");
   try {
      let respond = await axios.post(`/api/user/login`, formObj);

      if (!respond.data.success) {

         err.textContent = respond.data.message;
      }
      if (respond.data.success) {

         sessionStorage.setItem("token", respond.data.message);
         sessionStorage.setItem("name",respond.data.name);
         window.location.href = `views/`;
      }


   } catch (error) {

      err.textContent = error.message;
   }
})
