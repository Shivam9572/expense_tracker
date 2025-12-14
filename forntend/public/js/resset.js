const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
let domain="http://13.232.126.113";

let form = document.getElementById("form");
form.addEventListener("submit", async (e) => {
   e.preventDefault();

   let formData = new FormData(e.target);
   let formObj = Object.fromEntries(formData.entries());
   let err = document.getElementById("error");
   try {
      
      let respond = await axios.post(`${domain}/api/password/resset/`+token, formObj);

      if (!respond.data.success) {

         err.textContent = respond.data.failed;
      }
      if (respond.data.success) {


         window.location.href = `/login/?alertMessage=`+respond.data.success;
      }


   } catch (error) {

      err.textContent = error.message;
   }
})
