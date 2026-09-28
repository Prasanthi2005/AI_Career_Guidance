// ===========================
// Forgot Password JavaScript
// ===========================

const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const sendBtn = document.querySelector(".send-btn");

// ---------------------------
// Email Validation
// ---------------------------

function validateEmail(email) {

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);

}

// ---------------------------
// Form Submit
// ---------------------------

form.addEventListener("submit", function (e) {

    const email = emailInput.value.trim();

    if (email === "") {

        e.preventDefault();

        alert("Please enter your email.");

        emailInput.focus();

        return;

    }

    if (!validateEmail(email)) {

        e.preventDefault();

        alert("Please enter a valid email address.");

        emailInput.focus();

        return;

    }

    // Loading Animation

    sendBtn.disabled = true;

    sendBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Sending OTP...
    `;

});

// ---------------------------
// Input Focus Effect
// ---------------------------

emailInput.addEventListener("focus", () => {

    emailInput.style.transition = "0.3s";

});

emailInput.addEventListener("blur", () => {

    emailInput.style.transition = "0.3s";

});

// ---------------------------
// Enter Key
// ---------------------------

emailInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        form.requestSubmit();

    }

});

// ---------------------------
// Button Hover Animation
// ---------------------------

sendBtn.addEventListener("mouseenter", () => {

    sendBtn.style.transform = "translateY(-3px)";

});

sendBtn.addEventListener("mouseleave", () => {

    sendBtn.style.transform = "translateY(0px)";

});

// ---------------------------
// Fade In Animation
// ---------------------------

window.addEventListener("load", () => {

    document.body.style.opacity = "0";

    document.body.style.transition = "opacity .6s";

    setTimeout(() => {

        document.body.style.opacity = "1";

    }, 100);

});