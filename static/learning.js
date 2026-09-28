/* =========================================================
   AI CAREER GUIDANCE
   PERSONALIZED LEARNING PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("=================================");
    console.log("Learning page JavaScript loaded");
    console.log("=================================");


    /* =====================================================
       MAIN ELEMENTS
    ===================================================== */

    const learningContainer =
        document.querySelector(".learning-container");

    const courseContainer =
        document.getElementById("courseContainer");

    const progressFill =
        document.getElementById("progressFill");

    const progressText =
        document.getElementById("progressText");


    /* =====================================================
       CAREER
    ===================================================== */

    let career = "";

    if (learningContainer) {

        career =
            learningContainer.dataset.career || "";

    }


    console.log("Career:", career);


    /* =====================================================
       COURSE CARDS
    ===================================================== */

    const courseCards =
        document.querySelectorAll(".course-card");

    console.log(
        "Courses found:",
        courseCards.length
    );


    /* =====================================================
       PROGRESS STORAGE KEY
    ===================================================== */

    const safeCareer =
        career.trim() || "Software Developer";

    const progressKey =
        "careerLearningProgress_" + safeCareer;


    /* =====================================================
       LOAD SAVED PROGRESS
    ===================================================== */

    let completedCourses = [];

    try {

        const savedProgress =
            localStorage.getItem(progressKey);

        if (savedProgress) {

            completedCourses =
                JSON.parse(savedProgress);

        }

        if (!Array.isArray(completedCourses)) {

            completedCourses = [];

        }

    } catch (error) {

        console.error(
            "Could not load progress:",
            error
        );

        completedCourses = [];

    }


    /* =====================================================
       SAVE PROGRESS
    ===================================================== */

    function saveProgress() {

        try {

            localStorage.setItem(
                progressKey,
                JSON.stringify(completedCourses)
            );

        } catch (error) {

            console.error(
                "Could not save progress:",
                error
            );

        }

    }


    /* =====================================================
       UPDATE PROGRESS
    ===================================================== */

    function updateProgress() {

        const total =
            courseCards.length;

        const completed =
            completedCourses.length;


        let percentage = 0;


        if (total > 0) {

            percentage =
                Math.round(
                    (completed / total) * 100
                );

        }


        /* Progress bar */

        if (progressFill) {

            progressFill.style.width =
                percentage + "%";

        }


        /* Progress text */

        if (progressText) {

            progressText.textContent =
                percentage + "% Complete";

        }


        console.log(
            `Progress: ${completed}/${total} (${percentage}%)`
        );

    }


    /* =====================================================
       MARK CARD AS COMPLETED
    ===================================================== */

    function updateCardVisual(card, completed) {

        if (!card) {
            return;
        }


        const button =
            card.querySelector(
                ".learn-course-btn"
            );


        if (completed) {

            card.classList.add(
                "completed"
            );


            if (button) {

                button.innerHTML = `
                    <i class="fa-solid fa-circle-check"></i>
                    Completed
                `;

            }

        } else {

            card.classList.remove(
                "completed"
            );


            if (button) {

                button.innerHTML = `
                    <i class="fa-solid fa-play"></i>
                    Learn This Course
                `;

            }

        }

    }


    /* =====================================================
       LOAD CARD STATUS
    ===================================================== */

    courseCards.forEach(function (card) {

        const index =
            Number(card.dataset.index);


        const completed =
            completedCourses.includes(index);


        updateCardVisual(
            card,
            completed
        );

    });


    /* =====================================================
       COURSE MODAL ELEMENTS
    ===================================================== */

    const courseModal =
        document.getElementById(
            "courseModal"
        );

    const courseOverlay =
        document.getElementById(
            "courseOverlay"
        );

    const courseClose =
        document.getElementById(
            "courseClose"
        );

    const courseModalTitle =
        document.getElementById(
            "courseModalTitle"
        );

    const courseModalDescription =
        document.getElementById(
            "courseModalDescription"
        );

    const modalTopics =
        document.getElementById(
            "modalTopics"
        );

    const courseCompleteBtn =
        document.getElementById(
            "courseCompleteBtn"
        );


    /* =====================================================
       CURRENT COURSE
    ===================================================== */

    let currentCard = null;

    let currentIndex = -1;


    /* =====================================================
       GET COURSE DATA FROM CARD
    ===================================================== */

    function getCourseData(card) {

        if (!card) {

            return {
                title: "Course",
                description:
                    "Follow this course and practice the topics.",
                topics: []
            };

        }


        const titleElement =
            card.querySelector(
                ".course-content h3"
            );


        const descriptionElement =
            card.querySelector(
                ".course-content > p"
            );


        const topicElements =
            card.querySelectorAll(
                ".topic"
            );


        const title =
            titleElement
                ? titleElement.textContent.trim()
                : "Course";


        const description =
            descriptionElement
                ? descriptionElement.textContent.trim()
                : "Follow this course and practice the topics.";


        const topics = [];


        topicElements.forEach(
            function (topicElement) {

                const text =
                    topicElement.textContent.trim();

                if (text) {

                    topics.push(text);

                }

            }
        );


        return {
            title: title,
            description: description,
            topics: topics
        };

    }


    /* =====================================================
       OPEN MODAL
    ===================================================== */

    function openCourseModal(card) {

        if (!courseModal || !card) {

            return;

        }


        currentCard = card;

        currentIndex =
            Number(card.dataset.index);


        const courseData =
            getCourseData(card);


        /* Title */

        if (courseModalTitle) {

            courseModalTitle.textContent =
                courseData.title;

        }


        /* Description */

        if (courseModalDescription) {

            courseModalDescription.textContent =
                courseData.description;

        }


        /* Topics */

        if (modalTopics) {

            modalTopics.innerHTML = "";


            if (courseData.topics.length > 0) {

                courseData.topics.forEach(
                    function (topic) {

                        const topicElement =
                            document.createElement("div");


                        topicElement.className =
                            "modal-topic";


                        topicElement.innerHTML = `
                            <i class="fa-solid fa-circle-check"></i>
                            ${escapeHtml(topic)}
                        `;


                        modalTopics.appendChild(
                            topicElement
                        );

                    }
                );

            }

        }


        /* Complete button */

        const isCompleted =
            completedCourses.includes(
                currentIndex
            );


        if (courseCompleteBtn) {

            if (isCompleted) {

                courseCompleteBtn.innerHTML = `
                    <i class="fa-solid fa-rotate-left"></i>
                    Mark Course Incomplete
                `;

            } else {

                courseCompleteBtn.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    Mark Course Complete
                `;

            }

        }


        courseModal.classList.add(
            "active"
        );


        courseModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeCourseModal() {

        if (!courseModal) {

            return;

        }


        courseModal.classList.remove(
            "active"
        );


        courseModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }


    /* =====================================================
       HTML ESCAPE
    ===================================================== */

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       LEARN BUTTONS
    ===================================================== */

    document
        .querySelectorAll(".learn-course-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const card =
                        this.closest(
                            ".course-card"
                        );


                    if (!card) {

                        return;

                    }


                    openCourseModal(card);

                }
            );

        });


    /* =====================================================
       COMPLETE COURSE BUTTON
    ===================================================== */

    if (courseCompleteBtn) {

        courseCompleteBtn.addEventListener(
            "click",
            function () {

                if (
                    !currentCard ||
                    currentIndex < 0
                ) {

                    return;

                }


                const alreadyCompleted =
                    completedCourses.includes(
                        currentIndex
                    );


                if (alreadyCompleted) {

                    completedCourses =
                        completedCourses.filter(
                            function (index) {

                                return index !==
                                    currentIndex;

                            }
                        );

                } else {

                    if (
                        !completedCourses.includes(
                            currentIndex
                        )
                    ) {

                        completedCourses.push(
                            currentIndex
                        );

                    }

                }


                saveProgress();


                updateCardVisual(
                    currentCard,
                    !alreadyCompleted
                );


                updateProgress();


                const nowCompleted =
                    completedCourses.includes(
                        currentIndex
                    );


                if (nowCompleted) {

                    courseCompleteBtn.innerHTML = `
                        <i class="fa-solid fa-rotate-left"></i>
                        Mark Course Incomplete
                    `;

                } else {

                    courseCompleteBtn.innerHTML = `
                        <i class="fa-solid fa-check"></i>
                        Mark Course Complete
                    `;

                }

            }
        );

    }


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    if (courseClose) {

        courseClose.addEventListener(
            "click",
            closeCourseModal
        );

    }


    /* =====================================================
       OVERLAY CLICK
    ===================================================== */

    if (courseOverlay) {

        courseOverlay.addEventListener(
            "click",
            closeCourseModal
        );

    }


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                courseModal &&
                courseModal.classList.contains(
                    "active"
                )
            ) {

                closeCourseModal();

            }

        }
    );


    /* =====================================================
       INITIAL PROGRESS
    ===================================================== */

    updateProgress();


    /* =====================================================
       FINAL MESSAGE
    ===================================================== */

    console.log(
        "✅ Learning roadmap initialized successfully."
    );

});