const userId = localStorage.getItem("loggedInUserId");

const habitList = document.getElementById("habitList");
const completedToday = document.getElementById("completedToday");
const totalHabits = document.getElementById("totalHabits");
const dailyGoal = document.getElementById("dailyGoal");
const logoutButton = document.getElementById("logoutButton");

const addHabitForm = document.getElementById("addHabitForm");
const habitName = document.getElementById("habitName");
const habitDescription = document.getElementById("habitDescription");
const habitIcon = document.getElementById("habitIcon");
const habitMessage = document.getElementById("habitMessage");

const iconOptions = document.querySelectorAll(".icon-option");


// ================= LOGIN CHECK =================

if (!userId) {
    window.location.href = "login.html";
}


// ================= ICON PICKER =================

// Default selected icon
if (iconOptions.length > 15) {
    iconOptions[15].classList.add("selected");
}


// Select icon
iconOptions.forEach(function (button) {

    button.addEventListener("click", function () {

        iconOptions.forEach(function (item) {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        habitIcon.value =
            button.getAttribute("data-icon");

    });

});


// ================= LOGOUT =================

logoutButton.addEventListener("click", function () {

    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("loggedInUserEmail");

    window.location.href = "login.html";

});


// ================= LOAD HABITS =================

async function loadHabits() {

    try {

        const response = await fetch(
            `http://localhost:8081/api/habits/${userId}`
        );

        if (!response.ok) {
            throw new Error("Could not load habits");
        }

        const habits = await response.json();

        displayHabits(habits);

    } catch (error) {

        console.error(error);

        habitList.innerHTML = `
            <p>
                Cannot connect to backend.
                Make sure Spring Boot is running.
            </p>
        `;

    }

}


// ================= DISPLAY HABITS =================

function displayHabits(habits) {

    habitList.innerHTML = "";

    totalHabits.textContent = habits.length;

    let completed = 0;


    // No habits
    if (habits.length === 0) {

        habitList.innerHTML = `
            <div class="habit-item">

                <div class="habit-info">

                    <h3>
                        No habits yet
                    </h3>

                    <p>
                        Add your first habit above.
                    </p>

                </div>

            </div>
        `;

        updateProgress(0, 0);

        return;
    }


    // Display each habit
    habits.forEach(function (habit) {

        if (habit.completed) {
            completed++;
        }


        const habitItem =
            document.createElement("div");

        habitItem.className =
            "habit-item";


        habitItem.innerHTML = `

            <div class="habit-icon">
                ${habit.icon}
            </div>

            <div class="habit-info">

                <h3>
                    ${habit.name}
                </h3>

                <p>
                    ${habit.description}
                </p>

            </div>


            <button
                class="habit-status ${
                    habit.completed
                        ? "completed"
                        : ""
                }"
                data-id="${habit.id}"
            >
                ${
                    habit.completed
                        ? "Completed"
                        : "Pending"
                }
            </button>


            <button
                class="delete-habit"
                data-id="${habit.id}"
            >
                Delete
            </button>

        `;


        habitList.appendChild(habitItem);

    });


    // Update progress
    updateProgress(
        completed,
        habits.length
    );


    // ================= COMPLETE / PENDING BUTTONS =================

    const buttons =
        document.querySelectorAll(
            "#habitList .habit-status"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const habitId =
                    button.getAttribute("data-id");


                if (
                    button.textContent.trim()
                    === "Pending"
                ) {

                    completeHabit(habitId);

                } else {

                    uncompleteHabit(habitId);

                }

            }
        );

    });


    // ================= DELETE BUTTONS =================

    const deleteButtons =
        document.querySelectorAll(
            ".delete-habit"
        );


    deleteButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const habitId =
                    button.getAttribute("data-id");

                deleteHabit(habitId);

            }
        );

    });

}


// ================= COMPLETE HABIT =================

async function completeHabit(habitId) {

    try {

        const response = await fetch(
            `http://localhost:8081/api/habits/${habitId}/complete`,
            {
                method: "POST"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Could not complete habit"
            );

        }


        await loadHabits();

    } catch (error) {

        console.error(error);

        alert(
            "Could not update habit."
        );

    }

}


// ================= UNCOMPLETE HABIT =================

async function uncompleteHabit(habitId) {

    try {

        const response = await fetch(
            `http://localhost:8081/api/habits/${habitId}/complete`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Could not update habit"
            );

        }


        await loadHabits();

    } catch (error) {

        console.error(error);

        alert(
            "Could not update habit."
        );

    }

}


// ================= DELETE HABIT =================

async function deleteHabit(habitId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this habit?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `http://localhost:8081/api/habits/${habitId}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Could not delete habit"
            );

        }


        await loadHabits();

    } catch (error) {

        console.error(error);

        alert(
            "Could not delete habit."
        );

    }

}


// ================= UPDATE PROGRESS =================

function updateProgress(
    completed,
    total
) {

    completedToday.textContent =
        completed;


    if (total === 0) {

        dailyGoal.textContent =
            "0%";

        return;

    }


    const percentage =
        Math.round(
            (completed / total) * 100
        );


    dailyGoal.textContent =
        percentage + "%";

}


// ================= ADD HABIT =================

addHabitForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            habitName.value.trim();

        const description =
            habitDescription.value.trim();

        const icon =
            habitIcon.value.trim();


        if (
            !name ||
            !description ||
            !icon
        ) {

            habitMessage.textContent =
                "Please fill in all fields.";

            return;

        }


        try {

            habitMessage.textContent =
                "Adding habit...";


            const response =
                await fetch(
                    "http://localhost:8081/api/habits/add",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            userId:
                                Number(userId),

                            name:
                                name,

                            description:
                                description,

                            icon:
                                icon

                        })

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Could not add habit"
                );

            }


            habitMessage.textContent =
                "Habit added successfully!";


            addHabitForm.reset();


            // Restore default icon
            habitIcon.value = "🎯";


            iconOptions.forEach(
                function (item) {
                    item.classList.remove(
                        "selected"
                    );
                }
            );


            if (iconOptions.length > 15) {

                iconOptions[15].classList.add(
                    "selected"
                );

            }


            await loadHabits();


        } catch (error) {

            console.error(error);

            habitMessage.textContent =
                "Could not add habit. Try again.";

        }

    }
);


// ================= START PAGE =================

loadHabits();