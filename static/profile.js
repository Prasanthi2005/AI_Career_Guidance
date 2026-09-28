/* =========================================================
   PROFILE PAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("profileForm");

    const photoInput = document.getElementById("photo");

    const preview = document.getElementById("profilePreview");

    const defaultAvatar =
        document.getElementById("defaultAvatar");

    const saveBtn =
        document.getElementById("saveBtn");

    const fullname =
        document.getElementById("fullname");

    const phone =
        document.getElementById("phone");

    const cgpa =
        document.getElementById("cgpa");

    const skills =
        document.getElementById("skills");

    const projects =
        document.getElementById("projects");

    const certifications =
        document.getElementById("certifications");

    const github =
        document.getElementById("github");

    const linkedin =
        document.getElementById("linkedin");

    const completionPercent =
        document.getElementById("completionPercent");

    const completionBar =
        document.getElementById("completionBar");

    const sidebarName =
        document.getElementById("sidebarName");

    const skillQuickCount =
        document.getElementById("skillQuickCount");


    let originalData =
        new FormData(form);


    let hasChanges = false;


    /* =====================================================
       TEXT COUNTER
    ===================================================== */

    function updateCounter(
        input,
        counterId
    ) {

        if (!input) {
            return;
        }

        const counter =
            document.getElementById(counterId);

        if (!counter) {
            return;
        }

        counter.textContent =
            input.value.length;

    }


    /* =====================================================
       SKILL COUNT
    ===================================================== */

    function updateSkillCount() {

        if (!skills || !skillQuickCount) {
            return;
        }

        const value =
            skills.value.trim();

        if (!value) {

            skillQuickCount.textContent =
                "0";

            return;
        }

        const skillList =
            value
            .split(/[,|\n]/)
            .map(item => item.trim())
            .filter(Boolean);

        skillQuickCount.textContent =
            skillList.length;

    }


    /* =====================================================
       PROFILE COMPLETION
    ===================================================== */

    function calculateCompletion() {

        const fields = [

            fullname,

            phone,

            document.querySelector(
                '[name="college"]'
            ),

            document.querySelector(
                '[name="branch"]'
            ),

            cgpa,

            skills,

            projects,

            certifications,

            github,

            linkedin

        ];

        let completed = 0;

        fields.forEach(field => {

            if (
                field &&
                field.value.trim() !== ""
            ) {

                completed++;

            }

        });


        const percentage =
            Math.round(
                (completed / fields.length) * 100
            );


        completionPercent.textContent =
            percentage + "%";

        completionBar.style.width =
            percentage + "%";

    }


    /* =====================================================
       PHOTO PREVIEW
    ===================================================== */

    if (photoInput) {

        photoInput.addEventListener(
            "change",
            function() {

                const file =
                    this.files[0];

                if (!file) {
                    return;
                }


                const allowedTypes = [

                    "image/jpeg",

                    "image/png",

                    "image/jpg",

                    "image/gif",

                    "image/webp"

                ];


                if (!allowedTypes.includes(
                        file.type
                    )) {

                    showToast(
                        "Please select a valid image.",
                        true
                    );

                    this.value = "";

                    return;
                }


                // 5 MB limit

                if (
                    file.size >
                    5 * 1024 * 1024
                ) {

                    showToast(
                        "Image size must be below 5 MB.",
                        true
                    );

                    this.value = "";

                    return;
                }


                const reader =
                    new FileReader();


                reader.onload = function(event) {

                    preview.src =
                        event.target.result;

                    preview.classList.remove(
                        "hidden-photo"
                    );

                    preview.style.display =
                        "block";


                    if (defaultAvatar) {

                        defaultAvatar.style.display =
                            "none";

                    }

                };


                reader.readAsDataURL(file);

                hasChanges = true;

            }
        );

    }


    /* =====================================================
       LIVE NAME
    ===================================================== */

    if (fullname) {

        fullname.addEventListener(
            "input",
            () => {

                if (sidebarName) {

                    sidebarName.textContent =
                        fullname.value.trim() ||
                        "Your Name";

                }

                markChanged();

            }
        );

    }


    /* =====================================================
       PHONE VALIDATION
    ===================================================== */

    if (phone) {

        phone.addEventListener(
            "input",
            () => {

                phone.value =
                    phone.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                const message =
                    document.getElementById(
                        "phoneMessage"
                    );

                if (!message) {
                    return;
                }

                if (
                    phone.value.length === 0
                ) {

                    message.textContent =
                        "";

                    return;
                }


                if (
                    phone.value.length === 10
                ) {

                    message.textContent =
                        "Valid phone number";

                    message.className =
                        "valid";

                } else {

                    message.textContent =
                        "Enter 10 digits";

                    message.className =
                        "invalid";

                }

                markChanged();

            }
        );

    }


    /* =====================================================
       CGPA VALIDATION
    ===================================================== */

    if (cgpa) {

        cgpa.addEventListener(
            "input",
            () => {

                const value =
                    parseFloat(cgpa.value);

                const message =
                    document.getElementById(
                        "cgpaMessage"
                    );

                if (!cgpa.value) {

                    message.textContent =
                        "";

                    return;
                }


                if (
                    isNaN(value) ||
                    value < 0 ||
                    value > 10
                ) {

                    message.textContent =
                        "CGPA must be between 0 and 10.";

                    message.className =
                        "invalid";

                } else {

                    message.textContent =
                        "Valid CGPA";

                    message.className =
                        "valid";

                }

                markChanged();

            }
        );

    }


    /* =====================================================
       URL VALIDATION
    ===================================================== */

    function validateUrl(input) {

        if (!input || !input.value.trim()) {
            return true;
        }

        try {

            const url =
                new URL(
                    input.value.trim()
                );

            return (
                url.protocol === "http:" ||
                url.protocol === "https:"
            );

        } catch (error) {

            return false;

        }

    }


    /* =====================================================
       GENERIC CHANGE TRACKING
    ===================================================== */

    function markChanged() {

        hasChanges = true;

        calculateCompletion();

        updateSkillCount();

        updateCounter(
            skills,
            "skillsCount"
        );

        updateCounter(
            projects,
            "projectsCount"
        );

    }


    [
        skills,
        projects,
        certifications,
        github,
        linkedin,
        cgpa
    ].forEach(input => {

        if (!input) {
            return;
        }

        input.addEventListener(
            "input",
            markChanged
        );

    });


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            function(event) {

                // Phone

                if (
                    phone &&
                    phone.value &&
                    phone.value.length !== 10
                ) {

                    event.preventDefault();

                    showToast(
                        "Please enter a valid 10-digit phone number.",
                        true
                    );

                    phone.focus();

                    return;
                }


                // CGPA

                if (cgpa && cgpa.value) {

                    const value =
                        parseFloat(
                            cgpa.value
                        );

                    if (
                        isNaN(value) ||
                        value < 0 ||
                        value > 10
                    ) {

                        event.preventDefault();

                        showToast(
                            "Please enter a valid CGPA between 0 and 10.",
                            true
                        );

                        cgpa.focus();

                        return;
                    }

                }


                // GitHub

                if (
                    github &&
                    !validateUrl(github)
                ) {

                    event.preventDefault();

                    showToast(
                        "Please enter a valid GitHub URL.",
                        true
                    );

                    github.focus();

                    return;
                }


                // LinkedIn

                if (
                    linkedin &&
                    !validateUrl(linkedin)
                ) {

                    event.preventDefault();

                    showToast(
                        "Please enter a valid LinkedIn URL.",
                        true
                    );

                    linkedin.focus();

                    return;
                }


                // Save button loading

                if (saveBtn) {

                    saveBtn.disabled =
                        true;

                    saveBtn.innerHTML = `
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        <span>Saving...</span>
                    `;

                }

                hasChanges = false;

            }
        );

    }


    /* =====================================================
       UNSAVED CHANGES WARNING
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        function(event) {

            if (hasChanges) {

                event.preventDefault();

                event.returnValue = "";

            }

        }
    );


    /* =====================================================
       FLASH CLOSE
    ===================================================== */

    document.querySelectorAll(
        ".flash-close"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const parent =
                    button.closest(
                        ".flash-message"
                    );

                if (parent) {

                    parent.remove();

                }

            }
        );

    });


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(
        message,
        error = false
    ) {

        const toast =
            document.getElementById(
                "toast"
            );

        const toastMessage =
            document.getElementById(
                "toastMessage"
            );


        if (!toast || !toastMessage) {
            return;
        }


        toastMessage.textContent =
            message;


        const icon =
            toast.querySelector("i");


        if (error) {

            icon.className =
                "fa-solid fa-circle-exclamation";

        } else {

            icon.className =
                "fa-solid fa-circle-check";

        }


        toast.classList.add(
            "show"
        );


        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    updateCounter(
        skills,
        "skillsCount"
    );

    updateCounter(
        projects,
        "projectsCount"
    );

    updateSkillCount();

    calculateCompletion();


    /* =====================================================
       AUTO HIDE FLASH
    ===================================================== */

    setTimeout(
        () => {

            document.querySelectorAll(
                ".flash-message"
            ).forEach(message => {

                message.style.opacity =
                    "0";

                message.style.transform =
                    "translateX(30px)";

                setTimeout(
                    () => message.remove(),
                    300
                );

            });

        },
        4500
    );

});