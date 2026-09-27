const API_BASE_URL = "https://thegrind-production.up.railway.app";
const userId = localStorage.getItem("loggedInUserId");

const userName = document.getElementById("userName");
const logoutButton = document.getElementById("logoutButton");

const completedCount = document.getElementById("completedCount");
const totalHabitsElement = document.getElementById("totalHabits");
const currentStreakElement = document.getElementById("currentStreak");

const habitList = document.getElementById("habitList");


if (!userId) {
    window.location.href = "login.html";
}


// Show logged-in user's name
const loggedInUser = localStorage.getItem("loggedInUser");

if (loggedInUser) {
    userName.textContent = loggedInUser;
}


// Logout
logoutButton.addEventListener("click", function () {

    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("loggedInUserEmail");

    window.location.href = "login.html";

});


// Load dashboard
async function loadDashboard() {

    try {

        // Get habits from backend
        const response = await fetch(
            `${API_BASE_URL}/api/habits/${userId}`
        );

        if (!response.ok) {
            throw new Error("Could not load habits");
        }

        const habits = await response.json();


        // Total habits
        totalHabitsElement.textContent = habits.length;


        // Display habits
        displayHabits(habits);


        // Count completed habits
        let completed = 0;

        habits.forEach(function (habit) {

            if (habit.completed) {
                completed++;
            }

        });

        completedCount.textContent = completed;


        // Get current streak
        const streakResponse = await fetch(
            `${API_BASE_URL}/api/habits/progress/${userId}/streak`
        );

        if (!streakResponse.ok) {
            throw new Error("Could not load streak");
        }

        const streak = await streakResponse.json();

        currentStreakElement.textContent = streak;

    } 
    
    catch (error) {

        console.error("Dashboard error:", error);

        habitList.innerHTML = `
            <p>
                Cannot connect to backend.
                Make sure Spring Boot is running.
            </p>
        `;

    }

}


// Display habits on Dashboard
function displayHabits(habits) {

    habitList.innerHTML = "";


    habits.forEach(function (habit) {

        const habitItem = document.createElement("div");

        habitItem.className = "habit-item";


        habitItem.innerHTML = `

            <div class="habit-icon">
                ${habit.icon}
            </div>

            <div class="habit-info">

                <h3>${habit.name}</h3>

                <p>${habit.description}</p>

            </div>

            <button
                class="habit-status ${habit.completed ? "completed" : ""}"
                data-id="${habit.id}"
            >

                ${habit.completed ? "Completed" : "Pending"}

            </button>

        `;


        habitList.appendChild(habitItem);

    });


    // Add click events
    const buttons = document.querySelectorAll(".habit-status");


    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            const habitId = button.getAttribute("data-id");


            if (button.textContent.trim() === "Pending") {

                completeHabit(habitId);

            } 
            
            else {

                uncompleteHabit(habitId);

            }

        });

    });

}


// Complete habit
async function completeHabit(habitId) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/habits/${habitId}/complete`,
            {
                method: "POST"
            }
        );


        if (!response.ok) {
            throw new Error("Could not complete habit");
        }


        // Reload dashboard
        await loadDashboard();

    } 
    
    catch (error) {

        console.error(error);

        alert("Could not update habit.");

    }

}


// Undo habit
async function uncompleteHabit(habitId) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/habits/${habitId}/complete`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {
            throw new Error("Could not update habit");
        }


        // Reload dashboard
        await loadDashboard();

    } 
    
    catch (error) {

        console.error(error);

        alert("Could not update habit.");

    }

}


// Start dashboard
loadDashboard();