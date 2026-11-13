
const form = document.getElementById("registrationForm");
const message = document.getElementById("message");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

form.addEventListener("submit", function(event) {

    // Prevent page refresh
    event.preventDefault();

    // Check password match
    if (password.value !== confirmPassword.value) {
        message.textContent = "Passwords do not match!";
        message.className = "error";
        confirmPassword.focus();
        return;
    }

    // Get selected skills
    const selectedSkills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    // Show success message
    message.textContent =
        "Registration successful! Welcome, " +
        document.getElementById("name").value + "!";

    message.className = "success";

    // Reset the form
    form.reset();

});
