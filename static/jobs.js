document.addEventListener("DOMContentLoaded", () => {


    /* =========================
       SAVE JOB
    ========================= */

    const saveButtons =
        document.querySelectorAll(".save-job");


    let savedJobs =
        JSON.parse(
            localStorage.getItem("savedJobs") || "[]"
        );


    saveButtons.forEach(button => {

        const jobId =
            button.dataset.jobId;

        if (savedJobs.includes(jobId)) {

            button.classList.add("saved");

            button.innerHTML =
                '<i class="fa-solid fa-heart"></i>';

        }


        button.addEventListener("click", () => {

            if (savedJobs.includes(jobId)) {

                savedJobs =
                    savedJobs.filter(
                        id => id !== jobId
                    );

                button.classList.remove("saved");

                button.innerHTML =
                    '<i class="fa-regular fa-heart"></i>';

            } else {

                savedJobs.push(jobId);

                button.classList.add("saved");

                button.innerHTML =
                    '<i class="fa-solid fa-heart"></i>';

            }


            localStorage.setItem(
                "savedJobs",
                JSON.stringify(savedJobs)
            );

        });

    });


    /* =========================
       MODAL
    ========================= */

    const modal =
        document.getElementById("jobModal");

    const modalClose =
        document.getElementById("modalClose");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalCompany =
        document.getElementById("modalCompany");

    const modalLocation =
        document.getElementById("modalLocation");

    const modalSalary =
        document.getElementById("modalSalary");

    const modalDescription =
        document.getElementById("modalDescription");

    const modalApply =
        document.getElementById("modalApply");


    const detailButtons =
        document.querySelectorAll(".details-btn");


    detailButtons.forEach(button => {

        button.addEventListener("click", () => {

            const card =
                button.closest(".job-card");

            const data =
                card.querySelector(".job-data");


            const title =
                data.querySelector(".title").textContent.trim();

            const company =
                data.querySelector(".company").textContent.trim();

            const location =
                data.querySelector(".location").textContent.trim();

            const salary =
                data.querySelector(".salary").textContent.trim();

            const description =
                data.querySelector(".description").textContent.trim();

            const url =
                data.querySelector(".url").textContent.trim();


            modalTitle.textContent =
                title;

            modalCompany.textContent =
                company;

            modalLocation.innerHTML =
                `<i class="fa-solid fa-location-dot"></i>
                 ${location}`;

            modalSalary.innerHTML =
                `<i class="fa-solid fa-indian-rupee-sign"></i>
                 ${salary}`;

            modalDescription.textContent =
                description;

            modalApply.href =
                url;


            modal.classList.add("active");

            document.body.style.overflow =
                "hidden";

        });

    });


    /* =========================
       CLOSE MODAL
    ========================= */

    function closeModal() {

        modal.classList.remove("active");

        document.body.style.overflow =
            "";

    }


    modalClose.addEventListener(
        "click",
        closeModal
    );


    document.querySelector(
        ".modal-overlay"
    ).addEventListener(
        "click",
        closeModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeModal();

            }

        }
    );


    /* =========================
       MATCH BAR ANIMATION
    ========================= */

    const cards =
        document.querySelectorAll(".job-card");


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;


                    const bar =
                        entry.target.querySelector(
                            ".match-bar span"
                        );


                    if (bar) {

                        const width =
                            bar.style.width;

                        bar.style.width = "0";

                        requestAnimationFrame(() => {

                            bar.style.transition =
                                "width 1s ease";

                            bar.style.width =
                                width;

                        });

                    }


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.15
            }
        );


    cards.forEach(card =>
        observer.observe(card)
    );


});