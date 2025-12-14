

let pageData = {
    currpage: 0,
    prePage: false,
    nextPage: false,
    items: 0
}
let profile = document.getElementById("profile");
profile.textContent = sessionStorage.getItem("name");
//set offset default
let limit = sessionStorage.getItem("limit");
if (!limit) {
    sessionStorage.setItem("limit", "10");
}
let limitElement = document.getElementById("limit");
limitElement.value = sessionStorage.getItem("limit");

//changet offset limitper page
let limitVal = document.getElementById("limit");
limitVal.addEventListener("change", async (e) => {
    let value = e.target.value;
    sessionStorage.setItem("limit", value.toString());
    pageData.currpage = 0;
    getExpenses();
})
//check authentication
if (!sessionStorage.getItem("token")) {
    window.location.href = `/views/login.html`;
}

//alert for alert message  by using url 
const urlParams = new URLSearchParams(window.location.search);
const alertMessage = urlParams.get('alertMessage');
if (alertMessage) {
    alert("payment is " + alertMessage);
    window.location.search = "";
}





//delete a expense 
let delExpense = async (id) => {

    try {

        let result = await axios.delete(`/api/expense/${id}`);
        if (result.data.success) {

            let leader_btn = document.getElementById("leader_board_btn");
            if (leader_btn) {
                let parent = document.getElementById("leader_board");
                getAllExpense(parent);
            }
            pageData.items -= 1;

            if ((pageData.currpage == 0) && (pageData.items == 0)) {
                getExpenses();


                return;
            }
            if (pageData.items == 0) {
                pageData.currpage -= 1;
                getExpenses();
                return;
            }
            getExpenses();




        }
    } catch (error) {
        alert(error.message);
    }
}

//add expense in expense_list div element 
function addExpense(details) {
    let expense_list = document.getElementById("expense_list");
    
    let p = document.createElement("p");
    p.textContent = `${details.category}- ₹${details.amount}- ${details.description}`;
    p.style.display = "inline-flex";
    let delBtn = document.createElement("button");
    delBtn.classList.add("btn", "btn-danger", "mx-2");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", (e) => delExpense(details.id));
    p.appendChild(delBtn);
    

    expense_list.append(p);

}

//get expenses of a specific user
async function getExpenses() {

    sessionStorage.getItem("token");
    try {
        let expenseElement = document.getElementById("expense_list");
        expenseElement.textContent = "Loding....";
        let result = await axios.get(`/api/expense`, {
            params: {
                page: pageData.currpage,
                limit: sessionStorage.getItem("limit")
            },

            headers: {
                authorization: sessionStorage.getItem("token")
            }
        });
        pageData.items = result.data.expense.length;
        expenseElement.innerHTML = "";
        if (result.data.nextPage) {
            pageData.nextPage = true;
        } else {
            pageData.nextPage = false;
        }
        if (pageData.currpage > 0) {
            pageData.prePage = true;
        } else {
            pageData.prePage = false;
        }

        changePage(pageData, result.data.expense);
    } catch (error) {
        console.log(error);

    }
}
getExpenses();

//change page 
async function changePage(pageData, pageInfo) {
    let expense_list_div = document.getElementById("expense_list");
    

    if (pageData.items == 0) {
        expense_list_div.innerHTML = "<h2>No any Expense available</h2>";
    } else {
        expense_list_div.innerHTML = "";
    }
    for (let i = 0; i < pageInfo.length; i++) {
        
        addExpense(pageInfo[i]);
    }
    let preBtn = document.getElementById("pre");
    let nextBtn = document.getElementById("next");

    if (pageData.prePage) {
        preBtn.disabled = false;
    } else {
        preBtn.disabled = true;
    }

    if (pageData.nextPage) {
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }

    let f = document.getElementById("0");
    let s = document.getElementById("1");


    f.textContent = pageData.currpage + 1;
    s.textContent = pageData.currpage + 2;

}

//logut function
let logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", (e) => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("name");
    window.location.href = `/login`;
});

//sumit form for adding a new expense
let addexpense = document.getElementById("addexpense");
addexpense.addEventListener("submit", async (e) => {

    e.preventDefault();
    let formData = new FormData(e.target);
    let obj = Object.fromEntries(formData.entries());
    try {

        let result = await axios.post(`/api/expense`, obj, {
            headers: {
                authorization: sessionStorage.getItem("token")
            }
        });
        if (result) {
            addCategory([]);

            let leader_btn = document.getElementById("leader_board_btn");
            if (leader_btn) {
                let parent = document.getElementById("leader_board");
                getAllExpense(parent);
            }
            pageData.items += 1;

            if (pageData.items > sessionStorage.getItem("limit")) {
                pageData.currpage += 1;
                getExpenses();
                e.target.reset();
                return;
            }
            getExpenses();
            e.target.reset();

        } else {
            throw new Error("something went wrong");
        }
    } catch (error) {
        console.log(error.message);
    }

});



//show payment page
let subcription = document.getElementById("subcription");
subcription.addEventListener("click", (e) => {
    window.location.href = `/payment?token=` + sessionStorage.getItem("token");
});

// help ai function 

let alBtn = document.getElementById("ai");
alBtn.addEventListener("click", async (e) => {
    try {
        let descriptionValue = document.getElementById("description").value;

        if (descriptionValue.length < 1) {
            throw new Error("please enter something");
        }
        let result = await axios.post(`/api/gemini`, { content: `${descriptionValue}  suggest category for expense tracker` });

        addCategory(result.data.response.words);
    } catch (error) {
        console.log(error);
        errorShow(error.message);

    }
});

//add category option 
function addCategory(array) {
    let category = document.getElementById("category");
    category.innerHTML = "";
    let option = document.createElement("option");
        option.textContent ="salary";
        category.append(option);
    for (let i = 0; i < array.length; i++) {

        let option = document.createElement("option");
        option.textContent = array[i];
        category.append(option);
    }
}

//show error
function errorShow(message) {
    let errorDiv = document.getElementById("error");
    errorDiv.textContent = "";
    errorDiv.textContent = message;
    setTimeout(() => {
        let errorDiv = document.getElementById("error");
        errorDiv.textContent = "";
    }, 3000);

}


//function for next button
let nextBtn = document.getElementById("next");
nextBtn.addEventListener("click", (e) => {
    if (e.target.disabled) {
        return;
    }

    pageData.currpage = pageData.currpage + 1;

    getExpenses();
});

//function for previous button
let preBtn = document.getElementById("pre");
preBtn.addEventListener("click", (e) => {
    if (e.disabled) {
        return;
    }
    pageData.currpage = pageData.currpage - 1;

    getExpenses();
});

