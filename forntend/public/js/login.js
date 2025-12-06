let loginForm = document.getElementById("loginForm");
const urlParams = new URLSearchParams(window.location.search);
const alertMessage = urlParams.get('alertMessage');
if (alertMessage) {
   alert(alertMessage);
}
const b_domain="http://13.232.126.113:4000";
const f_domain="http://13.232.126.113:3000";
loginForm.addEventListener("submit", async (e) => {
   e.preventDefault();

   let formData = new FormData(e.target);
   let formObj = Object.fromEntries(formData.entries());
   let err = document.getElementById("error");
   try {
      let respond = await axios.post(`${b_domain}/user/login`, formObj);

      if (!respond.data.success) {

         err.textContent = respond.data.message;
      }
      if (respond.data.success) {

         sessionStorage.setItem("token", respond.data.message);
         sessionStorage.setItem("name",respond.data.name);
         window.location.href = `${f_domain}/`;
      }


   } catch (error) {

      err.textContent = error.message;
   }
})
