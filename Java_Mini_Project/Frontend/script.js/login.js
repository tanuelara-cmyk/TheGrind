const API_BASE_URL = "https://thegrind-production.up.railway.app";
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.textContent = "Logging in...";
    message.style.color = "#77716c";

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/users/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const text = await response.text();

console.log("Backend status:", response.status);
console.log("Backend response:", text);

let user = null;

if (text) {
    try {
        user = JSON.parse(text);
    } catch (error) {
        console.error("Response is not valid JSON:", text);
    }
}

if (response.ok && user && user.name) {

            
           localStorage.setItem("loggedInUser", user.name);
           localStorage.setItem("loggedInUserId", user.id);
           localStorage.setItem("loggedInUserEmail", user.email);

            message.textContent = "Login successful!";
            message.style.color = "green";

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 800);

        } else {

            message.textContent = "Invalid email or password.";
            message.style.color = "red";

        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Cannot connect to backend. Make sure Spring Boot is running.";

        message.style.color = "red";
    }

});