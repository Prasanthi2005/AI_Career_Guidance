// ==========================================
// AI Career Guidance Platform
// login.js
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================
    // Password Show / Hide
    // ==========================

    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener("click", function () {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                this.classList.remove("fa-eye");
                this.classList.add("fa-eye-slash");

            } else {

                passwordInput.type = "password";

                this.classList.remove("fa-eye-slash");
                this.classList.add("fa-eye");

            }

        });

    }

    // ==========================
    // Form Validation
    // ==========================

    const form = document.querySelector("form");

    if (form) {

        form.addEventListener("submit", function (e) {

            const email = document.getElementById("email").value.trim();
            const password = passwordInput.value.trim();

            if (email === "") {

                alert("Please enter your Email");
                e.preventDefault();
                return;

            }

            if (password === "") {

                alert("Please enter your Password");
                e.preventDefault();
                return;

            }

        });

    }

    // ==========================
    // Input Focus Animation
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
    // Login Button Hover
    // ==========================

    const loginBtn = document.querySelector(".login-btn");

    if (loginBtn) {

        loginBtn.addEventListener("mouseenter", function () {

            this.style.transform = "translateY(-3px)";

        });

        loginBtn.addEventListener("mouseleave", function () {

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

    // ==========================
    // Welcome Console Message
    // ==========================

    console.log("AI Career Guidance Login Page Loaded Successfully");

});