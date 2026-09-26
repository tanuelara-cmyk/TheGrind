const userId = localStorage.getItem("loggedInUserId");

const completedToday =
    document.getElementById("completedToday");

const dailyGoal =
    document.getElementById("dailyGoal");

const totalCompletions =
    document.getElementById("totalCompletions");

const progressPercentage =
    document.getElementById("progressPercentage");

const progressFill =
    document.getElementById("progressFill");

const progressMessage =
    document.getElementById("progressMessage");

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


// ================= LOAD PROGRESS =================

async function loadProgress() {

    try {

        // Get all habits
        const habitsResponse = await fetch(
            `http://localhost:8081/api/habits/${userId}`
        );

        if (!habitsResponse.ok) {
            throw new Error("Could not load habits");
        }

        const habits =
            await habitsResponse.json();


        // Get completed habits today
        const todayResponse = await fetch(
            `http://localhost:8081/api/habits/progress/${userId}`
        );

        if (!todayResponse.ok) {
            throw new Error(
                "Could not load today's progress"
            );
        }

        const todayCount =
            await todayResponse.json();


        // Get total completions
        const totalResponse = await fetch(
            `http://localhost:8081/api/habits/progress/${userId}/total`
        );

        if (!totalResponse.ok) {
            throw new Error(
                "Could not load total completions"
            );
        }

        const totalCount =
            await totalResponse.json();


        // Number of habits
        const totalHabits =
            habits.length;


        // Update statistics
        completedToday.textContent =
            todayCount;

        totalCompletions.textContent =
            totalCount;


        // ================= CALCULATE PERCENTAGE =================

        let percentage = 0;

        if (totalHabits > 0) {

            percentage =
                Math.round(
                    (todayCount / totalHabits) * 100
                );

        }


        // Prevent percentage above 100
        if (percentage > 100) {
            percentage = 100;
        }


        // Update percentage
        dailyGoal.textContent =
            percentage + "%";

        progressPercentage.textContent =
            percentage + "%";


        // Update progress bar
        progressFill.style.width =
            percentage + "%";


        // ================= PROGRESS MESSAGE =================

        if (percentage === 0) {

            progressMessage.textContent =
                "Start completing your habits today.";

        }
        else if (percentage < 100) {

            progressMessage.textContent =
                "Keep going. You are making progress.";

        }
        else {

            progressMessage.textContent =
                "All habits completed today. Great work!";

        }

    }
    catch (error) {

        console.error(
            "Progress error:",
            error
        );

        progressMessage.textContent =
            "Cannot connect to backend. Make sure Spring Boot is running.";

    }

}


// ================= START =================

loadProgress();