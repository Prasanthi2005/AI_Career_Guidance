document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {
        const target = Number(counter.dataset.target) || 0;
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 50));

        function updateCounter() {
            current += increment;

            if (current >= target) {
                counter.textContent = target;
                return;
            }

            counter.textContent = current;
            requestAnimationFrame(updateCounter);
        }

        updateCounter();
    });

    const progressBars = document.querySelectorAll(".progress-bar");

    setTimeout(() => {
        progressBars.forEach(bar => {
            const width = bar.dataset.width || "0%";
            bar.style.width = width;
        });
    }, 500);

    const currentPath = window.location.pathname;
    const sideLinks = document.querySelectorAll(".side-link");

    sideLinks.forEach(link => {
        const href = link.getAttribute("href");

        if (href === currentPath) {
            sideLinks.forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");
        }
    });

    const cards = document.querySelectorAll(".quick-card");

    cards.forEach(card => {
        card.addEventListener("click", function () {
            this.style.transform = "scale(.97)";

            setTimeout(() => {
                this.style.transform = "";
            }, 150);
        });
    });

    const header = document.querySelector(".dashboard-header");

    if (header) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 30) {
                header.style.boxShadow = "0 10px 40px rgba(0,0,0,.45)";
            } else {
                header.style.boxShadow = "0 10px 40px rgba(0,0,0,.25)";
            }
        });
    }

    const animatedElements = document.querySelectorAll(".stat-card, .quick-card, .journey-card");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {

    const openButton =
        document.getElementById("openAiAssistant");

    const chatOverlay =
        document.getElementById("aiChatOverlay");

    const closeButton =
        document.getElementById("closeAiChat");

    const sendButton =
        document.getElementById("sendAiMessage");

    const messageInput =
        document.getElementById("aiMessageInput");

    const messagesBox =
        document.getElementById("aiChatMessages");

    const quickQuestions =
        document.querySelectorAll(".quick-question");


    /* =================================================
       OPEN CHAT
    ================================================= */

    if (openButton && chatOverlay) {

        openButton.addEventListener("click", function () {

            chatOverlay.classList.add("show");

            document.body.style.overflow = "hidden";

            setTimeout(() => {

                if (messageInput) {
                    messageInput.focus();
                }

            }, 250);
        });
    }


    /* =================================================
       CLOSE CHAT
    ================================================= */

    function closeChat() {

        if (chatOverlay) {

            chatOverlay.classList.remove("show");

            document.body.style.overflow = "";
        }
    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeChat
        );
    }


    /* =================================================
       ESC KEY
    ================================================= */

    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            chatOverlay &&
            chatOverlay.classList.contains("show")
        ) {

            closeChat();
        }
    });


    /* =================================================
       SEND MESSAGE
    ================================================= */

    async function sendMessage() {

        if (!messageInput || !messagesBox) {
            return;
        }


        const message =
            messageInput.value.trim();


        if (!message) {
            return;
        }


        /* USER MESSAGE */

        const userMessage =
            document.createElement("div");

        userMessage.className =
            "ai-message user-message";


        userMessage.innerHTML = `
            <div class="message-content">
                <strong>You</strong>
                <p>${escapeHtml(message)}</p>
            </div>
        `;


        messagesBox.appendChild(userMessage);


        messageInput.value = "";


        messagesBox.scrollTop =
            messagesBox.scrollHeight;


        /* LOADING MESSAGE */

        const loadingMessage =
            document.createElement("div");

        loadingMessage.className =
            "ai-message";

        loadingMessage.id =
            "aiLoadingMessage";


        loadingMessage.innerHTML = `
            <div class="message-avatar">
                <i class="fa-solid fa-robot"></i>
            </div>

            <div class="message-content">
                <strong>AI Career Assistant</strong>
                <p>Thinking... 🤖</p>
            </div>
        `;


        messagesBox.appendChild(
            loadingMessage
        );


        messagesBox.scrollTop =
            messagesBox.scrollHeight;


        /* DISABLE SEND */

        if (sendButton) {

            sendButton.disabled = true;

            sendButton.style.opacity = "0.5";
        }


        try {

            const response =
                await fetch("/ai-assistant", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                });


            const data =
                await response.json();


            /* REMOVE LOADING */

            const loading =
                document.getElementById(
                    "aiLoadingMessage"
                );


            if (loading) {
                loading.remove();
            }


            /* SERVER ERROR */

           if (!response.ok) {
    throw new Error(
        data.reply ||
        data.error ||
        "AI service is temporarily unavailable."
    );
}


            /* AI MESSAGE */

            const aiMessage =
                document.createElement("div");

            aiMessage.className =
                "ai-message";


            aiMessage.innerHTML = `
                <div class="message-avatar">
                    <i class="fa-solid fa-robot"></i>
                </div>

                <div class="message-content">

                    <strong>
                        AI Career Assistant
                    </strong>

                    <p>${escapeHtml(
                        data.reply ||
                        "Sorry, I could not generate a response."
                    )}</p>

                </div>
            `;


            messagesBox.appendChild(
                aiMessage
            );


            messagesBox.scrollTop =
                messagesBox.scrollHeight;


        } catch (error) {

            console.error(
                "AI Assistant Error:",
                error
            );


            const loading =
                document.getElementById(
                    "aiLoadingMessage"
                );


            if (loading) {
                loading.remove();
            }


            const errorMessage =
                document.createElement("div");

            errorMessage.className =
                "ai-message";


            errorMessage.innerHTML = `
                <div class="message-avatar">
                    <i class="fa-solid fa-robot"></i>
                </div>

                <div class="message-content">

                    <strong>
                        AI Career Assistant
                    </strong>

                   <p>${escapeHtml(
    error.message || "AI service is temporarily unavailable."
)}</p>

                </div>
            `;


            messagesBox.appendChild(
                errorMessage
            );


            messagesBox.scrollTop =
                messagesBox.scrollHeight;


        } finally {

            if (sendButton) {

                sendButton.disabled = false;

                sendButton.style.opacity = "1";
            }


            if (messageInput) {

                messageInput.focus();
            }
        }
    }


    /* =================================================
       SEND BUTTON
    ================================================= */

    if (sendButton) {

        sendButton.addEventListener(
            "click",
            sendMessage
        );
    }


    /* =================================================
       ENTER TO SEND
    ================================================= */

    if (messageInput) {

        messageInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();
                }
            }
        );
    }


    /* =================================================
       QUICK QUESTIONS
    ================================================= */

    quickQuestions.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    if (!messageInput) {
                        return;
                    }


                    messageInput.value =
                        this.textContent.trim();


                    messageInput.focus();
                }
            );
        }
    );


    /* =================================================
       HTML ESCAPE
    ================================================= */

    function escapeHtml(text) {

        const div =
            document.createElement("div");

        div.textContent =
            String(text);

        return div.innerHTML;
    }

});