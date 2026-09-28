document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       Progress Bar Animation
    ===================================== */

    const progress = document.querySelector(".progress-fill");

    if (progress) {

        const width = progress.dataset.width;

        setTimeout(() => {

            progress.style.width = width;

        }, 400);
    }


    /* =====================================
       Score Circle
    ===================================== */

    const scoreCircle =
        document.querySelector(".score-circle");

    if (scoreCircle) {

        const score =
            Number(scoreCircle.dataset.score || 0);

        const degrees =
            (score / 100) * 360;

        scoreCircle.style.background = `
            radial-gradient(
                circle,
                #071a3c 57%,
                transparent 58%
            ),
            conic-gradient(
                #00eaff ${degrees}deg,
                #087bff ${degrees}deg,
                rgba(255,255,255,.08) ${degrees}deg
            )
        `;
    }


    /* =====================================
       Scroll Reveal Animation
    ===================================== */

    const cards =
        document.querySelectorAll(
            ".content-card, .stat-card, .target-career"
        );

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    cards.forEach(card => {

        card.classList.add("reveal");

        observer.observe(card);

    });

/* =====================================
   Learning Button
===================================== */

const learnButtons =
    document.querySelectorAll(".learn-btn");

learnButtons.forEach(button => {

    button.addEventListener("click", () => {

        const skill =
            button.dataset.skill;

        if (!skill) {
            console.error("Learning skill not found");
            return;
        }

        const learningUrl =
            "/learning?skill=" +
            encodeURIComponent(skill);

        window.location.href =
            learningUrl;

    });

});


    /* =====================================
       Smooth Hover Effect
    ===================================== */

    document
        .querySelectorAll(".project-card")
        .forEach(card => {

            card.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX - rect.left;

                    const y =
                        event.clientY - rect.top;

                    const rotateX =
                        ((y / rect.height) - 0.5) * -4;

                    const rotateY =
                        ((x / rect.width) - 0.5) * 4;

                    card.style.transform =
                        `perspective(700px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-5px)`;
                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "";

                }
            );

        });

});