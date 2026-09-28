document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       Notes Search
    ===================================== */

    const searchInput =
        document.getElementById("notesSearch");

    const noteCards =
        document.querySelectorAll(".note-card");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const searchText =
                    searchInput.value
                        .toLowerCase()
                        .trim();


                noteCards.forEach(card => {

                    const text =
                        card.textContent
                            .toLowerCase();


                    if (
                        text.includes(searchText)
                    ) {

                        card.style.display = "";

                    } else {

                        card.style.display = "none";

                    }

                });

            }
        );

    }


    /* =====================================
       Scroll Animation
    ===================================== */

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "show"
                        );

                    }

                });

            },
            {
                threshold: 0.1
            }
        );


    noteCards.forEach(card => {

        card.classList.add("note-hidden");

        observer.observe(card);

    });

});