document.addEventListener("DOMContentLoaded", () => {


    /* =====================================
       Animated Placement Counter
    ===================================== */

    const counter = document.querySelector(".counter");

    if (counter) {

        const target = parseInt(
            counter.dataset.target
        ) || 0;

        let current = 0;

        const duration = 1400;

        const startTime = performance.now();


        function animateCounter(currentTime) {

            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            current = Math.floor(
                progress * target
            );

            counter.textContent = current;


            if (progress < 1) {

                requestAnimationFrame(
                    animateCounter
                );

            } else {

                counter.textContent = target;

            }

        }


        requestAnimationFrame(
            animateCounter
        );
    }



    /* =====================================
       Animated Progress Bars
    ===================================== */

    const bars = document.querySelectorAll(
        ".bar-fill"
    );


    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const bar = entry.target;

                    const width =
                        bar.dataset.width || 0;

                    setTimeout(() => {

                        bar.style.width =
                            width + "%";

                    }, 150);

                    observer.unobserve(bar);
                }

            });

        },

        {
            threshold: 0.3
        }

    );


    bars.forEach(bar => {

        observer.observe(bar);

    });



    /* =====================================
       Card Reveal Animation
    ===================================== */

    const cards = document.querySelectorAll(
        ".factor-card, .insight-card, .skills-section, .missing-section"
    );


    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(20px)";


        setTimeout(() => {

            card.style.transition =
                "opacity .6s ease, transform .6s ease";

            card.style.opacity = "1";

            card.style.transform =
                "translateY(0)";

        }, 150 + (index * 100));

    });

});