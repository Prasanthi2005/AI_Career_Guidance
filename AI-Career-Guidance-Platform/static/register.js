// ==========================================
// AI Career Guidance Platform
// register.js
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================
    // Password Show / Hide
    // ==========================

// ==========================
// Password Show / Hide
// ==========================

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirm = document.getElementById("toggleConfirm");


// Password Eye
if (togglePassword && password) {

    togglePassword.addEventListener("click", function () {

        if (password.type === "password") {

            password.type = "text";
            this.textContent = "🙈";

        } else {

            password.type = "password";
            this.textContent = "👁";

        }

    });

}


// Confirm Password Eye
if (toggleConfirm && confirmPassword) {

    toggleConfirm.addEventListener("click", function () {

        if (confirmPassword.type === "password") {

            confirmPassword.type = "text";
            this.textContent = "🙈";

        } else {

            confirmPassword.type = "password";
            this.textContent = "👁";

        }

    });

}

    // ==========================
    // Form Validation
    // ==========================

    const form = document.querySelector("form");

    form.addEventListener("submit", function (e) {

        const fullname = document.querySelector('input[name="fullname"]').value.trim();
        const email = document.querySelector('input[name="email"]').value.trim();
        const phone = document.querySelector('input[name="phone"]').value.trim();
        const college = document.querySelector('input[name="college"]').value.trim();
        const branch = document.querySelector('input[name="branch"]').value.trim();
        const cgpa = document.querySelector('input[name="cgpa"]').value.trim();

        const pass = password.value.trim();
        const confirm = confirmPassword.value.trim();

        if (fullname === "") {
            alert("Please enter Full Name");
            e.preventDefault();
            return;
        }

        if (email === "") {
            alert("Please enter Email");
            e.preventDefault();
            return;
        }

        if (phone === "") {
            alert("Please enter Phone Number");
            e.preventDefault();
            return;
        }

        if (phone.length !== 10 || isNaN(phone)) {
            alert("Phone Number must contain exactly 10 digits");
            e.preventDefault();
            return;
        }

        if (college === "") {
            alert("Please enter College Name");
            e.preventDefault();
            return;
        }

        if (branch === "") {
            alert("Please enter Branch");
            e.preventDefault();
            return;
        }

        if (cgpa === "") {
            alert("Please enter CGPA");
            e.preventDefault();
            return;
        }

        if (pass.length < 6) {
            alert("Password must contain at least 6 characters");
            e.preventDefault();
            return;
        }

        if (pass !== confirm) {
            alert("Password and Confirm Password do not match");
            e.preventDefault();
            return;
        }

    });

    // ==========================
    // Input Animation
    // ==========================

    const inputs = document.querySelectorAll(".input-box input");

    inputs.forEach(function (input) {

        input.addEventListener("focus", function () {

            this.parentElement.style.transform = "scale(1.02)";
            this.parentElement.style.transition = "0.3s";

        });

        input.addEventListener("blur", function () {

            this.parentElement.style.transform = "scale(1)";

        });

    });

    // ==========================
    // Register Button Hover
    // ==========================

    const registerBtn = document.querySelector(".register-btn");

    if (registerBtn) {

        registerBtn.addEventListener("mouseenter", function () {

            this.style.transform = "translateY(-3px)";

        });

        registerBtn.addEventListener("mouseleave", function () {

            this.style.transform = "translateY(0px)";

        });

    }

    // ==========================
    // Google Button Hover
    // ==========================

    const googleBtn = document.querySelector(".google-btn");

    if (googleBtn) {

        googleBtn.addEventListener("mouseenter", function () {

            this.style.transform = "translateY(-3px)";

        });

        googleBtn.addEventListener("mouseleave", function () {

            this.style.transform = "translateY(0px)";

        });

    }

    console.log("Register Page Loaded Successfully");

});