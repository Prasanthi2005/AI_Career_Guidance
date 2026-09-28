// ===============================
// Toggle Password
// ===============================

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm_password");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirm = document.getElementById("toggleConfirm");

if (togglePassword) {
    togglePassword.addEventListener("click", () => {

        if (password.type === "password") {
            password.type = "text";
            togglePassword.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            password.type = "password";
            togglePassword.classList.replace("fa-eye-slash", "fa-eye");
        }

    });
}

if (toggleConfirm) {
    toggleConfirm.addEventListener("click", () => {

        if (confirmPassword.type === "password") {
            confirmPassword.type = "text";
            toggleConfirm.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            confirmPassword.type = "password";
            toggleConfirm.classList.replace("fa-eye-slash", "fa-eye");
        }

    });
}

// ===============================
// Password Strength
// ===============================

const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");

if (password) {

    password.addEventListener("keyup", () => {

        const value = password.value;

        let strength = 0;

        if (value.length >= 8) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/[0-9]/.test(value)) strength++;
        if (/[^A-Za-z0-9]/.test(value)) strength++;

        if (strength === 0) {
            strengthBar.style.width = "0%";
            strengthText.innerHTML = "";
        }

        else if (strength === 1) {
            strengthBar.style.width = "25%";
            strengthBar.style.background = "#ff3b30";
            strengthText.innerHTML = "Weak Password";
        }

        else if (strength === 2) {
            strengthBar.style.width = "50%";
            strengthBar.style.background = "#ff9800";
            strengthText.innerHTML = "Medium Password";
        }

        else if (strength === 3) {
            strengthBar.style.width = "75%";
            strengthBar.style.background = "#ffee00";
            strengthText.innerHTML = "Good Password";
        }

        else {
            strengthBar.style.width = "100%";
            strengthBar.style.background = "#00e676";
            strengthText.innerHTML = "Strong Password";
        }

    });

}

// ===============================
// Form Validation
// ===============================

const form = document.getElementById("resetForm");

if (form) {

    form.addEventListener("submit", function (e) {

        if (password.value !== confirmPassword.value) {

            e.preventDefault();

            alert("Passwords do not match!");

            confirmPassword.focus();

            return;

        }

        if (password.value.length < 8) {

            e.preventDefault();

            alert("Password must be at least 8 characters.");

            password.focus();

            return;

        }

    });

}

// ===============================
// Button Animation
// ===============================

const btn = document.querySelector("button");

if (btn) {

    btn.addEventListener("click", () => {

        btn.style.transform = "scale(.95)";

        setTimeout(() => {

            btn.style.transform = "scale(1)";

        }, 150);

    });

}