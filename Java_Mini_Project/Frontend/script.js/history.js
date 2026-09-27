const API_BASE_URL = "https://thegrind-production.up.railway.app";
const userId = localStorage.getItem("loggedInUserId");

const historyList =
    document.getElementById("historyList");

const logoutButton =
    document.getElementById("logoutButton");


// ================= LOGIN CHECK =================

if (!userId) {
    window.location.href = "login.html";
}


// ================= LOGOUT =================

logoutButton.addEventListener("click", function () {

    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("loggedInUserEmail");

    window.location.href = "login.html";

});


// ================= LOAD HISTORY =================

async function loadHistory() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/habits/history/${userId}`
        );

        if (!response.ok) {
            throw new Error("Could not load history");
        }

        const history = await response.json();

        console.log("History data:", history);

        displayHistory(history);

    }
    catch (error) {

        console.error(
            "History error:",
            error
        );

        historyList.innerHTML = `
            <div class="habit-item">

                <div class="habit-info">

                    <h3>
                        Unable to load history
                    </h3>

                    <p>
                        Make sure Spring Boot is running
                        and try refreshing the page.
                    </p>

                </div>

            </div>
        `;
    }
}


// ================= DISPLAY HISTORY =================

function displayHistory(history) {

    historyList.innerHTML = "";

    // No history
    if (!history || history.length === 0) {

        historyList.innerHTML = `
            <div class="habit-item">

                <div class="habit-info">

                    <h3>
                        No completed habits yet
                    </h3>

                    <p>
                        Complete a habit and it will
                        appear here.
                    </p>

                </div>

            </div>
        `;

        return;
    }


    let currentDate = "";


    history.forEach(function (item) {

        const date = item.completion_date;


        // Convert timestamp to IST date
        const istDate = getISTDateKey(date);


        // New date heading
        if (istDate !== currentDate) {

            currentDate = istDate;


            const dateHeading =
                document.createElement("div");


            dateHeading.className =
                "history-date";


            dateHeading.textContent =
                formatDate(date);


            historyList.appendChild(
                dateHeading
            );

        }


        // ================= HABIT ITEM =================

        const habitItem =
            document.createElement("div");


        habitItem.className =
            "habit-item";


        habitItem.innerHTML = `

            <div class="habit-icon">
                ${item.icon || "🎯"}
            </div>

            <div class="habit-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    Completed
                </p>

            </div>

            <span class="habit-status completed">
                ✓ Done
            </span>

        `;


        historyList.appendChild(
            habitItem
        );

    });

}


// ================= FORMAT DATE =================

function formatDate(dateString) {

    if (!dateString) {
        return "Unknown date";
    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {
        return String(dateString);
    }


    return date.toLocaleDateString("en-IN", {

        day: "numeric",

        month: "long",

        year: "numeric",

        timeZone: "Asia/Kolkata"

    });

}


// ================= IST DATE KEY =================

function getISTDateKey(dateString) {

    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {
        return String(dateString);
    }


    return date.toLocaleDateString("en-CA", {

        timeZone: "Asia/Kolkata"

    });

}


// ================= START =================

loadHistory();