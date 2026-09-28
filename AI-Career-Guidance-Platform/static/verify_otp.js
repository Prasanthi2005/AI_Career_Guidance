document.addEventListener("DOMContentLoaded", function () {

    const otpInputs = document.querySelectorAll(".otp-input");
    const hiddenOtp = document.getElementById("otp");
    const timer = document.getElementById("countdown");
    const form = document.querySelector("form");
    const verifyBtn = document.querySelector(".verify-btn");
    const resendLink = document.querySelector(".resend a");

    // -----------------------------
    // OTP Auto Next
    // -----------------------------

    otpInputs.forEach((input, index) => {

        input.addEventListener("input", function () {

            this.value = this.value.replace(/[^0-9]/g, "");

            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }

            updateOTP();

        });

        input.addEventListener("keydown", function (e) {

            if (e.key === "Backspace" &&
                this.value === "" &&
                index > 0) {

                otpInputs[index - 1].focus();

            }

        });

    });

    // -----------------------------
    // Paste OTP
    // -----------------------------

    otpInputs[0].addEventListener("paste", function (e) {

        e.preventDefault();

        const data = (e.clipboardData || window.clipboardData)
            .getData("text")
            .replace(/\D/g, "")
            .substring(0, 6);

        data.split("").forEach((num, i) => {

            if (otpInputs[i]) {

                otpInputs[i].value = num;

            }

        });

        updateOTP();

    });

    // -----------------------------
    // Hidden OTP
    // -----------------------------

    function updateOTP() {

        let otp = "";

        otpInputs.forEach(box => {

            otp += box.value;

        });

        hiddenOtp.value = otp;

    }

    // -----------------------------
    // Form Validation
    // -----------------------------

    form.addEventListener("submit", function (e) {

        updateOTP();

        if (hiddenOtp.value.length !== 6) {

            e.preventDefault();

            alert("Please enter 6-digit OTP.");

        }

    });

    // -----------------------------
    // 60 Seconds Timer
    // -----------------------------

    let seconds = 60;

    resendLink.style.pointerEvents = "none";
    resendLink.style.opacity = "0.5";

    const countdown = setInterval(() => {

        seconds--;

        timer.innerHTML = `00:${seconds < 10 ? "0" + seconds : seconds}`;

        if (seconds <= 0) {

            clearInterval(countdown);

            timer.innerHTML = "Expired";

            verifyBtn.disabled = true;

            verifyBtn.innerHTML = "OTP Expired";

            resendLink.style.pointerEvents = "auto";

            resendLink.style.opacity = "1";

            resendLink.innerHTML = "Resend OTP";

        }

    }, 1000);

});