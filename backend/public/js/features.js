
async function isPreminum() {
    try {

        let result = await axios.get(`api/user/isPremium`, {
            headers: {
                authorization: sessionStorage.getItem("token")
            }
        });
        if (result.data.isPremium) {

            forPremium();

        } else {

            let premium = document.getElementById("premium");
            if (premium) {
                premium.style.display = "none";
            }
        }
    } catch (error) {
        console.log(error);
        errorShow("something went wrong");
    }
}

//check is premium or not
isPreminum();
//not display element
function notDisplay(element) {
    element.style.display = "none";
}

// add button for feature 
function addButton() {
    let features = document.getElementById("features");

    //create button for add i features
    let leaderbtn = document.createElement("button");
    let reportBtn = document.createElement("button");
    let showHistoryBtn = document.createElement("button");
    const yearSelectInput = document.createElement("select");
    const monthSelectInput = document.createElement("select");

    // set id of button
    leaderbtn.id = "leader_board_btn";
    reportBtn.id = "report_btn";
    showHistoryBtn.id = "show_btn";
    yearSelectInput.id = "year";
    monthSelectInput.id = "month";

    //set text context in button
    leaderbtn.textContent = "Leader Board";
    reportBtn.textContent = "Generates report";
    showHistoryBtn.textContent = "show Downloaded";

    //aplly style in button
    leaderbtn.classList.add("btn", "btn-success", "mx-3", "p-2");
    reportBtn.classList.add("btn", "btn-success", "mx-3", "p-2");
    showHistoryBtn.classList.add("btn", "btn-primary", "mx-3", "p-2");
    monthSelectInput.classList.add("btn", "mx-3", "p-2");

    addYear(yearSelectInput);
    addMonth(monthSelectInput);

    // add all button in feature div
    features.append(leaderbtn, reportBtn, yearSelectInput, monthSelectInput, showHistoryBtn);

}

//add option year in select input
let addYear = (parent) => {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2023; year--) {
        let option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        parent.appendChild(option);
    }
}

//add option  month in select input
let addMonth = (parent) => {
    const months = [
        "all", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const currentMonth = new Date().getMonth() + 1; // 1–12
    months.forEach((month, index) => {
        let option = document.createElement("option");
        option.value = month;
        option.textContent = month;
        if (index + 1 === currentMonth) {
            option.selected = true
            parent.add(option);

        }
        parent.add(option);

    });
}
let forPremium = async () => {
    let subcription = document.getElementById("subcription");
    if (subcription) {
        notDisplay(subcription);
    }

    addButton();

    //get all button of features
    let leaderbtn = document.getElementById("leader_board_btn");
    let reportBtn = document.getElementById("report_btn");
    let showHistoryBtn = document.getElementById("show_btn");

    //add event listener of all fetures button
    leaderbtn.addEventListener("click", leaderBtnEvent);
    reportBtn.addEventListener("click", reportBtnEvent);
    showHistoryBtn.addEventListener("click", showHistoryBtnEvent);

}

// return now time and date
function currTime() {
    const now = new Date(); // Get the current date and time in the user's local timezone

    // Create a DateTimeFormat object for India Standard Time (Asia/Kolkata)
    const options = {
        timeZone: 'Asia/Kolkata', // Specify the IANA timezone identifier for India
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true // Use 12-hour format with AM/PM
    };

    const indianDateTime = new Intl.DateTimeFormat('en-IN', options).format(now);

    return indianDateTime;
}

//generate report
let reportGenerate = async (data) => {
    let nowTime = currTime();

    let reportContent=document.createElement("div");
     reportContent.innerHTML = `<h1 class="text-primary-emphasis text-center">Day to Day Expenses</h1>`;
     reportContent.id="report_content";
    
     
     
    let pNOwDate = document.createElement("p");
    pNOwDate.textContent = nowTime;
    reportContent.append(pNOwDate);
   

    Object.entries(data).forEach(([key, value]) => {
        let yearly = [];
        let yIncome = 0;
        let yExpense = 0;
        let pYear = document.createElement("p");
        pYear.textContent = key;
        pYear.className = "year";
        reportContent.append(pYear);
        Object.entries(value).forEach(([mName, month]) => {
            let totalInome = 0;
            let totalExpense = 0;
            let pMonth = document.createElement("p");
            pMonth.textContent = mName;
            pMonth.className = "year";
            reportContent.append(pMonth);
            let table = document.createElement("table");
            table.className = "report_month_table";
            table.classList.add("table-bordered", "table", "table-striped-columns");
            table.innerHTML = `<tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Salary</th>
            <th>Expense</th>
        </tr>`;
            for (let d = 0; d < month.length; d++) {
                let income = 0;
                let eAmount = 0;
                for (let e = 0; e < month[d].length; e++) {

                    let row = document.createElement("tr");
                    
                    if (month[d][e].category.toLowerCase() == "salary") {
                        income += month[d][e].expense;
                        row.innerHTML = ` <td>${month[d][e].date}</td>
                                           <td>${month[d][e].description}</td>
                                           <td>${month[d][e].category}</td>
                                           <td>${month[d][e].expense}.00</td>
                                          <td></td>`;
                    }
                    if ( (month[d][e].category!="salary")&&(month[d][e].expense)) {
                        eAmount += month[d][e].expense;
                        row.innerHTML = ` <td>${month[d][e].date}</td>
                                       <td>${month[d][e].description}</td>
                                       <td>${month[d][e].category}</td>
                                       <td></td>
                                       <td>${month[d][e].expense}.00</td>`;
                    }

                    table.append(row);
                }
                totalExpense += eAmount;
                totalInome += income;
                let row = document.createElement("tr");
                row.innerHTML = ` <td></td>
                              <td></td>
                              <td></td>
                              <td>${income}.00</td>
                              <td>${eAmount}.00</td>`;
                row.className = "c_row";
                table.append(row);
            }
            let row = document.createElement("tr");
            row.innerHTML = ` <td></td>
            <td></td>
            <td></td>
            <td>${totalInome}</td>
            <td>${totalExpense}</td>`;
            row.className = "c_row";
            table.append(row);
            row.innerHTML = ` <td class="s_d"></td>
            <td class="s_d"></td>
            <td class="s_d"></td>
            <td class="s_d"></td>
            <td class="s_d">Savings=₹${totalInome - totalExpense}</td>`;
            row.style.color = "blue";
            row.className = "s_row";
            table.append(row);
            yearly.push({ month: mName, income: totalInome, expense: totalExpense, saving: (totalInome - totalExpense) });

            reportContent.append(table);
            yIncome += totalInome;
            yExpense += totalExpense;
        });
        let p = document.createElement("p");
        p.textContent = "Yearly Report";
        p.className = "year";
        p.style.textAlign = "center";
        reportContent.append(p);
        let yTable = document.createElement("table");
        yTable.className = "report_month_table";
        yTable.classList.add("table-bordered", "table");
        yTable.innerHTML = `<tr>
            <th>Month</th>
            <th>Income</th>
            <th>Expense</th>
            <th>Savings</th>
        </tr>`;
        reportContent.append(yTable);

        for (let m = 0; m < yearly.length; m++) {

            let row = document.createElement("tr");
            row.innerHTML = ` <td>${yearly[m].month}</td>
            <td>${yearly[m].income}</td>
            <td>${yearly[m].expense}</td>
            <td>${yearly[m].income - yearly[m].expense}</td>`;
            yTable.append(row);
        }
        let row = document.createElement("tr");
        row.innerHTML = `<td  class="s_d"></td>
            <td  class="s_d">₹${yIncome}</td>
            <td  class="s_d">₹${yExpense}</td>
            <td  class="s_d text-primary">₹${yIncome - yExpense}</td>`;
        row.className = "c_row";
        yTable.append(row);

    });
     
    return new Promise((reslove,reject)=>{
        reslove(reportContent);
    })


}

// get all expense of all exiting users 
async function getAllExpense(parent) {

    try {

        let result = await axios.get(`api/premium/allExpense`);

        for (let i = 0; i < result.data.length; i++) {
            if (result.data[i].total_amount < 1) {
                continue;
            }
            let li = document.createElement("li");
            let p = document.createElement("p");
            p.textContent = `Name: ${result.data[i].name}  Total amount:${result.data[i].total_amount}`;
            p.style.display = "inline-flex";
            li.appendChild(p);
            li.className = "expense";
            li.id = result.data[i].id;
            parent.append(li);
        }

        return new Promise((result, reject) => {
            result(parent);
        });
    } catch (error) {
        console.log(error);
    }
}


//dowload button click function
function dowloadReport(element) {

     // Target the HTML element to convert
    const options = {
        margin: 1,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(options).save();
}

let showHistoryBtnEvent = async () => {

    try {
        let result = await axios.get(`api/user/download`, {
            headers: { authorization: sessionStorage.getItem("token") }
        });
        let features_content = document.getElementById("features_content");
        let showBtn = document.getElementById("show_btn");
        let display = showBtn.classList.contains("display");

        if (display) {
            showBtn.classList.remove("display");
            features_content.innerHTML = "";

            return;
        }
        showBtn.classList.add("display");
        features_content.innerHTML = "";
        let div=document.createElement("div");
        div.style.display="inline-flex";
        div.style.marginLeft="6rem";
        div.classList.add("flex-column","p-2");

        result.data.message.forEach((element) => {
              let li=document.createElement("li");
              li.id=element.url;
              li.textContent=`${element.year}-${element.month}`;
              
              let btn=document.createElement("button");
              btn.textContent="Download";
              btn.classList.add("btn","btn-success","m-2");
              btn.addEventListener("click",async(e)=>{
                 let id=e.target.parentElement.id;
                 try {
                    let data=await axios.get(id);
                    let pdf=await reportGenerate(data.data);
                    dowloadReport(pdf);
                 } catch (error) {
                    console.log(error);
                    errorShow("something went wrong");
                 }
              })
              li.append(btn);
              div.append(li);


        });
        features_content.append(div);

    } catch (error) {
        console.log(error);
    }

}

let leaderBtnEvent = async () => {
    let features_content = document.getElementById("features_content");
    let display = features_content.classList.contains("display");

    if (display) {
        features_content.classList.remove("display");
        features_content.innerHTML = "";

        return;
    }

    features_content.classList.add("display");
    let leader_board = document.createElement("div");
    leader_board.style.display = "flex";

    leader_board.classList.add("flex-column", "p-3");
    let element = await getAllExpense(leader_board);

    addContent(element);
}

let addContent = (element) => {
    let features_content = document.getElementById("features_content");
    features_content.append(element);
}
let reportBtnEvent = async () => {
    try {

        let year = document.getElementById("year").value;
        let month = document.getElementById("month").value;
        const bodyData = {
            year: year,
            month: month
        }
        let response = await axios.get(`api/user/gernateReport`, {

            headers: { authorization: sessionStorage.token },
            params: bodyData
        });
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        let fileData = await axios.get(response.data.message);

        let featureContent = document.getElementById("features_content");
        featureContent.innerHTML = "";


        let display = document.getElementById("report_btn").classList.contains("display");
        if (display) {
            featureContent.innerHTML = "";
            document.getElementById("report_btn").classList.remove("display");

            return;
        }
        document.getElementById("report_btn").classList.add("display");

        let reportContent = `<div id="d_btn">
        <button class="btn bg-danger  disable"data-bs-toggle="button">Download Report</button>
        </div>`;
        featureContent.innerHTML = reportContent;
       let element=await reportGenerate(fileData.data);
         
         addContent(element);
        let dBtn = document.getElementById("d_btn");
        dBtn.addEventListener("click", () => {
            dowloadReport(element);
        });

        



    } catch (error) {
        console.log(error.message);
        errorShow("something went wrong");
    }

}
