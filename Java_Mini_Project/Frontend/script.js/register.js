const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.textContent = "Creating your account...";

    try {

        const response = await fetch("http://localhost:8081/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const result = await response.text();

        console.log("Backend response:", result);
        console.log("Status:", response.status);

       if (response.ok) {

    message.textContent = "Registration successful!";
    message.style.color = "green";

    registerForm.reset();

    setTimeout(function () {
        message.textContent = "";
    }, 3000);

}else {

            message.textContent = "Registration failed: " + result;
            message.style.color = "red";
        }

    } catch (error) {

        console.error("Error:", error);

        message.textContent =
            "Cannot connect to backend. Make sure Spring Boot is running.";

        message.style.color = "red";
    }
});