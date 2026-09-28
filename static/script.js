// ============================================
// AI Career Guidance Platform - script.js
// ============================================

// Welcome Message
window.addEventListener("load", function () {
    console.log("AI Career Guidance Platform Loaded Successfully!");
});

// ============================================
// Smooth Scrolling
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

// ============================================
// Navbar Background Change on Scroll
// ============================================

window.addEventListener("scroll", function () {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 80) {

        navbar.style.background = "rgba(5,15,35,0.95)";
        navbar.style.boxShadow = "0 5px 20px rgba(0,229,255,.3)";

    } else {

        navbar.style.background = "rgba(0,0,0,.35)";
        navbar.style.boxShadow = "none";

    }

});

// ============================================
// Animated Counter
// ============================================

const counters = document.querySelectorAll(".stat-box h2");

const speed = 150;

counters.forEach(counter => {

    function updateCounter() {

        const target = counter.innerText;

        const number = parseInt(target.replace(/\D/g, ""));

        const suffix = target.replace(/[0-9]/g, "");

        let current = Number(counter.getAttribute("data-count")) || 0;

        const increment = Math.ceil(number / speed);

        if (current < number) {

            current += increment;

            if (current > number) current = number;

            counter.innerText = current + suffix;

            counter.setAttribute("data-count", current);

            setTimeout(updateCounter, 20);

        }

    }

    updateCounter();

});

// ============================================
// Scroll Reveal Animation
// ============================================

const revealElements = document.querySelectorAll(
    ".feature-card,.module-box,.why-grid div,.about,.contact,.stat-box"
);

window.addEventListener("scroll", reveal);

function reveal() {

    let windowHeight = window.innerHeight;

    revealElements.forEach(el => {

        let elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {

            el.style.opacity = "1";
            el.style.transform = "translateY(0px)";

        }

    });

}

revealElements.forEach(el => {

    el.style.opacity = "0";
    el.style.transform = "translateY(60px)";
    el.style.transition = "1s";

});

// ============================================
// Hero Button Ripple Effect
// ============================================

const buttons = document.querySelectorAll(".btn-primary,.btn-secondary");

buttons.forEach(button => {

    button.addEventListener("mouseenter", () => {

        button.style.transform = "scale(1.05)";

    });

    button.addEventListener("mouseleave", () => {

        button.style.transform = "scale(1)";

    });

});

// ============================================
// Back To Top Button
// ============================================

const topButton = document.createElement("button");

topButton.innerHTML = "⬆";

topButton.classList.add("top-btn");

document.body.appendChild(topButton);

topButton.style.position = "fixed";
topButton.style.right = "30px";
topButton.style.bottom = "30px";
topButton.style.width = "50px";
topButton.style.height = "50px";
topButton.style.borderRadius = "50%";
topButton.style.border = "none";
topButton.style.background = "#00e5ff";
topButton.style.color = "#000";
topButton.style.cursor = "pointer";
topButton.style.display = "none";
topButton.style.fontSize = "20px";
topButton.style.fontWeight = "bold";
topButton.style.boxShadow = "0 0 20px cyan";
topButton.style.zIndex = "1000";

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        topButton.style.display = "block";

    } else {

        topButton.style.display = "none";

    }

});

topButton.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

// ============================================
// Contact Form Validation
// ============================================

const form = document.querySelector("form");

if (form) {

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const inputs = form.querySelectorAll("input, textarea");

        let valid = true;

        inputs.forEach(input => {

            if (input.value.trim() === "") {

                valid = false;

                input.style.border = "2px solid red";

            } else {

                input.style.border = "none";

            }

        });

        if (valid) {

            alert("Message Sent Successfully!");

            form.reset();

        }

    });

}

// ============================================
// AI Greeting Based on Time
// ============================================

const hour = new Date().getHours();

let greeting = "";

if (hour < 12) {

    greeting = "Good Morning";

}
else if (hour < 18) {

    greeting = "Good Afternoon";

}
else {

    greeting = "Good Evening";

}

console.log(greeting + " Welcome to AI Career Guidance Platform!");

// ============================================
// Hero Image Rotation Animation
// ============================================

const heroImage = document.querySelector(".hero-right img");

if (heroImage) {

    let angle = 0;

    setInterval(() => {

        angle += 1;

        heroImage.style.transform =
            `translateY(-10px) rotate(${Math.sin(angle / 20) * 2}deg)`;

    }, 50);

}

// ============================================
// Feature Card Hover Sound (Optional)
// ============================================

// const audio = new Audio("hover.mp3");

// document.querySelectorAll(".feature-card").forEach(card => {

//     card.addEventListener("mouseenter",()=>{

//         audio.play();

//     });

// });

// ============================================
// End
// ============================================

console.log("AI Career Guidance Platform Ready 🚀");