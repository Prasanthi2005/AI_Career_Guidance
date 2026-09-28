/* =====================================================
   AI MOCK INTERVIEW
   COMPLETE FIXED VERSION
===================================================== */


/* =====================================================
   QUESTIONS
===================================================== */

const questions = {

    "Frontend Developer": [

        {
            category: "HR ROUND",
            difficulty: "EASY",
            time: 90,
            question: "Tell me about yourself and why you want to become a Frontend Developer."
        },

        {
            category: "TECHNICAL",
            difficulty: "MEDIUM",
            time: 90,
            question: "What is the difference between HTML, CSS and JavaScript?"
        },

        {
            category: "TECHNICAL",
            difficulty: "MEDIUM",
            time: 90,
            question: "Explain the CSS box model and how it affects the layout of a webpage."
        },

        {
            category: "TECHNICAL",
            difficulty: "HARD",
            time: 120,
            question: "What is the difference between let, const and var in JavaScript?"
        },

        {
            category: "SCENARIO",
            difficulty: "HARD",
            time: 120,
            question: "Suppose your website is very slow. How would you identify and improve its performance?"
        },

        {
            category: "HR ROUND",
            difficulty: "MEDIUM",
            time: 90,
            question: "Why should we hire you for a Frontend Developer position?"
        }

    ],


    "Python Developer": [

        {
            category: "HR ROUND",
            difficulty: "EASY",
            time: 90,
            question: "Tell me about yourself and your experience with Python."
        },

        {
            category: "TECHNICAL",
            difficulty: "MEDIUM",
            time: 90,
            question: "What are the differences between a list, tuple, set and dictionary in Python?"
        },

        {
            category: "TECHNICAL",
            difficulty: "MEDIUM",
            time: 90,
            question: "Explain object oriented programming concepts in Python."
        },

        {
            category: "TECHNICAL",
            difficulty: "HARD",
            time: 120,
            question: "What is the difference between shallow copy and deep copy in Python?"
        },

        {
            category: "SCENARIO",
            difficulty: "HARD",
            time: 120,
            question: "How would you debug a Python application that suddenly became slow?"
        },

        {
            category: "HR ROUND",
            difficulty: "MEDIUM",
            time: 90,
            question: "Why should we hire you as a Python Developer?"
        }

    ],


    "Backend Developer": [

        {
            category: "HR ROUND",
            difficulty: "EASY",
            time: 90,
            question: "Tell me about yourself and your interest in backend development."
        },

        {
            category: "TECHNICAL",
            difficulty: "MEDIUM",
            time: 90,
            question: "What is an API and how does a REST API work?"
        },

        {
            category: "TECHNICAL",
            difficulty: "MEDIUM",
            time: 90,
            question: "Explain the difference between GET, POST, PUT and DELETE."
        },

        {
            category: "TECHNICAL",
            difficulty: "HARD",
            time: 120,
            question: "How would you design authentication for a web application?"
        },

        {
            category: "SCENARIO",
            difficulty: "HARD",
            time: 120,
            question: "Your API suddenly receives thousands of requests. How would you handle the situation?"
        },

        {
            category: "HR ROUND",
            difficulty: "MEDIUM",
            time: 90,
            question: "Why should we hire you as a Backend Developer?"
        }

    ],


    "Full Stack Developer": [

        {
            category: "HR ROUND",
            difficulty: "EASY",
            time: 90,
            question: "Tell me about yourself and your Full Stack development experience."
        },

        {
            category: "TECHNICAL",
            difficulty: "MEDIUM",
            time: 90,
            question: "Explain how frontend, backend and database communicate in a web application."
        },

        {
            category: "TECHNICAL",
            difficulty: "MEDIUM",
            time: 90,
            question: "What is REST API and why is it important in full stack applications?"
        },

        {
            category: "TECHNICAL",
            difficulty: "HARD",
            time: 120,
            question: "How would you secure a full stack web application?"
        },

        {
            category: "SCENARIO",
            difficulty: "HARD",
            time: 120,
            question: "A production application is returning errors randomly. How would you investigate it?"
        },

        {
            category: "HR ROUND",
            difficulty: "MEDIUM",
            time: 90,
            question: "Why should we hire you as a Full Stack Developer?"
        }

    ],


    "Data Scientist": [

        {
            category: "HR ROUND",
            difficulty: "EASY",
            time: 90,
            question: "Tell me about yourself and why you want to become a Data Scientist."
        },

        {
            category: "TECHNICAL",
            difficulty: "MEDIUM",
            time: 90,
            question: "What is the difference between supervised and unsupervised learning?"
        },

        {
            category: "TECHNICAL",
            difficulty: "MEDIUM",
            time: 90,
            question: "What is overfitting and how can you prevent it?"
        },

        {
            category: "TECHNICAL",
            difficulty: "HARD",
            time: 120,
            question: "Explain precision, recall and F1 score."
        },

        {
            category: "SCENARIO",
            difficulty: "HARD",
            time: 120,
            question: "Your machine learning model performs well on training data but poorly on test data. What would you do?"
        },

        {
            category: "HR ROUND",
            difficulty: "MEDIUM",
            time: 90,
            question: "Why should we hire you as a Data Scientist?"
        }

    ],


    "AI / Machine Learning Engineer": [

        {
            category: "HR ROUND",
            difficulty: "EASY",
            time: 90,
            question: "Tell me about yourself and why you want to work in Artificial Intelligence."
        },

        {
            category: "TECHNICAL",
            difficulty: "MEDIUM",
            time: 90,
            question: "What is machine learning and how is it different from traditional programming?"
        },

        {
            category: "TECHNICAL",
            difficulty: "MEDIUM",
            time: 90,
            question: "Explain the difference between classification and regression."
        },

        {
            category: "TECHNICAL",
            difficulty: "HARD",
            time: 120,
            question: "Explain overfitting, underfitting and regularization."
        },

        {
            category: "SCENARIO",
            difficulty: "HARD",
            time: 120,
            question: "Your ML model performs poorly after deployment. How would you investigate the problem?"
        },

        {
            category: "HR ROUND",
            difficulty: "MEDIUM",
            time: 90,
            question: "Why should we hire you as an AI or Machine Learning Engineer?"
        }

    ]

};


/* =====================================================
   STATE
===================================================== */

let selectedCareer = "Frontend Developer";

let currentQuestion = 0;

let timerValue = 90;

let timerInterval = null;

let recognition = null;

let isListening = false;

let recognitionStarting = false;

let transcriptText = "";

let interimTranscript = "";

let answers = [];

let stream = null;

let interviewFinished = false;

let speechNetworkError = false;


/* =====================================================
   ELEMENTS
===================================================== */

const setupScreen =
    document.getElementById("setupScreen");

const interviewScreen =
    document.getElementById("interviewScreen");

const evaluatingScreen =
    document.getElementById("evaluatingScreen");

const resultScreen =
    document.getElementById("resultScreen");

const careerSelect =
    document.getElementById("careerSelect");

const startInterviewBtn =
    document.getElementById("startInterviewBtn");

const cameraVideo =
    document.getElementById("cameraVideo");

const cameraPlaceholder =
    document.getElementById("cameraPlaceholder");

const questionText =
    document.getElementById("questionText");

const questionCategory =
    document.getElementById("questionCategory");

const difficulty =
    document.getElementById("difficulty");

const questionNumber =
    document.getElementById("questionNumber");

const progressFill =
    document.getElementById("progressFill");

const timer =
    document.getElementById("timer");

const transcript =
    document.getElementById("transcript");

const wordCount =
    document.getElementById("wordCount");

const startAnswerBtn =
    document.getElementById("startAnswerBtn");

const stopAnswerBtn =
    document.getElementById("stopAnswerBtn");

const submitAnswerBtn =
    document.getElementById("submitAnswerBtn");

const listeningStatus =
    document.getElementById("listeningStatus");

const speakQuestionBtn =
    document.getElementById("speakQuestionBtn");


/* =====================================================
   CHECK ELEMENTS
===================================================== */

if (!careerSelect) {

    console.error(
        "careerSelect element not found."
    );

}

if (!startInterviewBtn) {

    console.error(
        "startInterviewBtn element not found."
    );

}

if (!questionText) {

    console.error(
        "questionText element not found."
    );

}

if (!transcript) {

    console.error(
        "transcript element not found."
    );

}

if (!startAnswerBtn) {

    console.error(
        "startAnswerBtn element not found."
    );

}

if (!stopAnswerBtn) {

    console.error(
        "stopAnswerBtn element not found."
    );

}

if (!submitAnswerBtn) {

    console.error(
        "submitAnswerBtn element not found."
    );

}


/* =====================================================
   CAREER SELECT
===================================================== */

if (careerSelect) {

    careerSelect.addEventListener(
        "change",
        function () {

            selectedCareer =
                this.value;

            console.log(
                "Selected career:",
                selectedCareer
            );

        }
    );

}


/* =====================================================
   START INTERVIEW
===================================================== */

if (startInterviewBtn) {

    startInterviewBtn.addEventListener(
        "click",
        async function () {

            selectedCareer =
                careerSelect
                    ? careerSelect.value
                    : "Frontend Developer";

            currentQuestion = 0;

            answers = [];

            interviewFinished = false;

            speechNetworkError = false;


            console.log(
                "Starting interview:",
                selectedCareer
            );


            /* -----------------------------------------
               CAMERA + MICROPHONE
            ----------------------------------------- */

            try {

                await startCamera();

            } catch (error) {

                console.error(
                    "Camera/Microphone error:",
                    error
                );

                alert(
                    error.message ||
                    "Camera or microphone could not be accessed."
                );

                return;

            }


            /* -----------------------------------------
               BACKEND CAREER
            ----------------------------------------- */

            try {

                const response =
                    await fetch(
                        "/interview/set-career",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                career:
                                    selectedCareer
                            })
                        }
                    );


                if (!response.ok) {

                    console.warn(
                        "Career backend returned:",
                        response.status
                    );

                }

            } catch (error) {

                console.warn(
                    "Career session update failed:",
                    error
                );

            }


            /* -----------------------------------------
               SHOW INTERVIEW SCREEN
            ----------------------------------------- */

            if (setupScreen) {

                setupScreen.classList.add(
                    "hidden"
                );

            }

            if (interviewScreen) {

                interviewScreen.classList.remove(
                    "hidden"
                );

            }


            loadQuestion();


            /* -----------------------------------------
               SPEAK QUESTION
            ----------------------------------------- */

            setTimeout(
                function () {

                    speakCurrentQuestion();

                },
                700
            );

        }
    );

}


/* =====================================================
   CAMERA + MICROPHONE
===================================================== */

async function startCamera() {

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        throw new Error(
            "Camera and microphone are not supported by this browser."
        );

    }


    console.log(
        "Requesting camera + microphone..."
    );


    try {

        stream =
            await navigator.mediaDevices.getUserMedia({

                video: {

                    width: {
                        ideal: 720
                    },

                    height: {
                        ideal: 480
                    },

                    facingMode: "user"

                },

                audio: {

                    echoCancellation: true,

                    noiseSuppression: true,

                    autoGainControl: true

                }

            });


        console.log(
            "Camera + microphone permission granted."
        );


        const audioTracks =
            stream.getAudioTracks();

        const videoTracks =
            stream.getVideoTracks();


        console.log(
            "Audio tracks:",
            audioTracks
        );

        console.log(
            "Video tracks:",
            videoTracks
        );


        if (audioTracks.length === 0) {

            throw new Error(
                "No microphone audio track was found."
            );

        }


        if (videoTracks.length === 0) {

            throw new Error(
                "No camera video track was found."
            );

        }


        /* -----------------------------------------
           CAMERA PREVIEW
        ----------------------------------------- */

        if (cameraVideo) {

            cameraVideo.srcObject =
                stream;

            cameraVideo.muted =
                true;

            cameraVideo.playsInline =
                true;

            cameraVideo.autoplay =
                true;


            try {

                await cameraVideo.play();

            } catch (error) {

                console.warn(
                    "Camera video play warning:",
                    error
                );

            }

        }


        /* -----------------------------------------
           HIDE PLACEHOLDER
        ----------------------------------------- */

        if (cameraPlaceholder) {

            cameraPlaceholder.style.display =
                "none";

        }


        return true;

    } catch (error) {

        console.error(
            "getUserMedia ERROR:",
            error.name,
            error.message
        );


        /* -----------------------------------------
           PERMISSION DENIED
        ----------------------------------------- */

        if (
            error.name ===
            "NotAllowedError"
        ) {

            throw new Error(
                "Camera or microphone permission was denied. Please allow both for 127.0.0.1:5000 and try again."
            );

        }


        /* -----------------------------------------
           DEVICE NOT FOUND
        ----------------------------------------- */

        if (
            error.name ===
            "NotFoundError"
        ) {

            throw new Error(
                "Camera or microphone device was not found."
            );

        }


        /* -----------------------------------------
           DEVICE BUSY
        ----------------------------------------- */

        if (
            error.name ===
            "NotReadableError"
        ) {

            throw new Error(
                "Camera or microphone is already being used by another application."
            );

        }


        /* -----------------------------------------
           CONSTRAINT ERROR
        ----------------------------------------- */

        if (
            error.name ===
            "OverconstrainedError"
        ) {

            throw new Error(
                "Camera settings are not supported by your device."
            );

        }


        throw error;

    }

}


/* =====================================================
   LOAD QUESTION
===================================================== */

function loadQuestion() {

    const list =
        questions[selectedCareer];


    if (
        !list ||
        !list.length
    ) {

        console.error(
            "No questions found for:",
            selectedCareer
        );

        return;

    }


    const q =
        list[currentQuestion];


    /* -----------------------------------------
       QUESTION UI
    ----------------------------------------- */

    if (questionText) {

        questionText.textContent =
            q.question;

    }


    if (questionCategory) {

        questionCategory.textContent =
            q.category;

    }


    if (difficulty) {

        difficulty.textContent =
            q.difficulty;

    }


    if (questionNumber) {

        questionNumber.textContent =
            `Question ${currentQuestion + 1} of ${list.length}`;

    }


    if (progressFill) {

        progressFill.style.width =
            `${((currentQuestion + 1) / list.length) * 100}%`;

    }


    /* -----------------------------------------
       TIMER
    ----------------------------------------- */

    timerValue =
        q.time;

    updateTimer();

    stopTimer();


    /* -----------------------------------------
       STOP PREVIOUS RECOGNITION
    ----------------------------------------- */

    stopRecognition();


    /* -----------------------------------------
       RESET SPEECH
    ----------------------------------------- */

    transcriptText = "";

    interimTranscript = "";


    if (transcript) {

        transcript.innerHTML =
            `<span class="placeholder-text">
                Click "Start Answer" and speak naturally...
            </span>`;

    }


    if (wordCount) {

        wordCount.textContent =
            "0 words";

    }


    if (submitAnswerBtn) {

        submitAnswerBtn.disabled =
            true;

    }


    if (startAnswerBtn) {

        startAnswerBtn.disabled =
            false;

    }


    if (stopAnswerBtn) {

        stopAnswerBtn.disabled =
            true;

    }


    if (listeningStatus) {

        listeningStatus.classList.add(
            "hidden"
        );

    }


    speechNetworkError = false;


    startTimer();

}


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    stopTimer();


    timerInterval =
        setInterval(
            function () {

                timerValue--;

                updateTimer();


                if (
                    timerValue <= 0
                ) {

                    stopTimer();


                    if (isListening) {

                        stopRecognition();

                    }


                    setTimeout(
                        function () {

                            if (
                                transcriptText.trim()
                            ) {

                                submitAnswer();

                            } else {

                                alert(
                                    "Time is over. Please try to give an answer."
                                );

                            }

                        },
                        300
                    );

                }

            },
            1000
        );

}


function stopTimer() {

    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;

    }

}


function updateTimer() {

    if (!timer) return;


    const minutes =
        Math.floor(
            timerValue / 60
        );


    const seconds =
        timerValue % 60;


    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/* =====================================================
   SPEECH RECOGNITION
===================================================== */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


/* =====================================================
   SETUP SPEECH RECOGNITION
===================================================== */

function setupSpeechRecognition() {

    if (!SpeechRecognition) {

        console.error(
            "SpeechRecognition is not supported."
        );

        return;

    }


    recognition =
        new SpeechRecognition();


    recognition.continuous =
        true;


    recognition.interimResults =
        true;


    recognition.lang =
        "en-US";


    recognition.maxAlternatives =
        1;


    /* -----------------------------------------
       ON START
    ----------------------------------------- */

    recognition.onstart =
        function () {

            recognitionStarting =
                false;

            isListening =
                true;

            speechNetworkError =
                false;


            if (startAnswerBtn) {

                startAnswerBtn.disabled =
                    true;

            }


            if (stopAnswerBtn) {

                stopAnswerBtn.disabled =
                    false;

            }


            if (submitAnswerBtn) {

                submitAnswerBtn.disabled =
                    true;

            }


            if (listeningStatus) {

                listeningStatus.classList.remove(
                    "hidden"
                );

            }


            console.log(
                "🎤 Speech recognition started"
            );

        };


    /* -----------------------------------------
       ON RESULT
    ----------------------------------------- */

    recognition.onresult =
        function (event) {

            let finalText = "";

            let currentInterim = "";


            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                const result =
                    event.results[i];


                const text =
                    result[0].transcript;


                if (
                    result.isFinal
                ) {

                    finalText +=
                        text + " ";

                } else {

                    currentInterim +=
                        text;

                }

            }


            /* -----------------------------------------
               SAVE FINAL TEXT
            ----------------------------------------- */

            if (finalText) {

                transcriptText +=
                    finalText;

            }


            interimTranscript =
                currentInterim;


            /* -----------------------------------------
               DISPLAY
            ----------------------------------------- */

            const displayText =
                (
                    transcriptText +
                    interimTranscript
                ).trim();


            if (displayText) {

                if (transcript) {

                    transcript.textContent =
                        displayText;

                }

            } else {

                if (transcript) {

                    transcript.textContent =
                        "Listening...";

                }

            }


            updateWordCount(
                displayText
            );

        };


    /* -----------------------------------------
       ON ERROR
    ----------------------------------------- */

    recognition.onerror =
        function (event) {

            console.warn(
                "Speech recognition error:",
                event.error
            );


            /* -----------------------------------------
               PERMISSION DENIED
            ----------------------------------------- */

            if (
                event.error ===
                "not-allowed"
            ) {

                isListening =
                    false;

                recognitionStarting =
                    false;


                if (listeningStatus) {

                    listeningStatus.classList.add(
                        "hidden"
                    );

                }


                if (startAnswerBtn) {

                    startAnswerBtn.disabled =
                        false;

                }


                if (stopAnswerBtn) {

                    stopAnswerBtn.disabled =
                        true;

                }


                alert(
                    "Microphone permission was denied. Please allow microphone access for 127.0.0.1:5000."
                );

                return;

            }


            /* -----------------------------------------
               AUDIO CAPTURE
            ----------------------------------------- */

            if (
                event.error ===
                "audio-capture"
            ) {

                isListening =
                    false;

                recognitionStarting =
                    false;


                if (listeningStatus) {

                    listeningStatus.classList.add(
                        "hidden"
                    );

                }


                alert(
                    "Microphone could not be detected. Please check your microphone."
                );

                return;

            }


            /* -----------------------------------------
               NETWORK ERROR
            ----------------------------------------- */

            if (
                event.error ===
                "network"
            ) {

                console.warn(
                    "Speech recognition network service failed."
                );


                speechNetworkError =
                    true;

                isListening =
                    false;

                recognitionStarting =
                    false;


                if (listeningStatus) {

                    listeningStatus.classList.add(
                        "hidden"
                    );

                }


                if (startAnswerBtn) {

                    startAnswerBtn.disabled =
                        false;

                }


                if (stopAnswerBtn) {

                    stopAnswerBtn.disabled =
                        true;

                }


                /*
                 * Do not continuously restart
                 * after network error.
                 */

                alert(
                    "Voice recognition service could not connect. Please check your internet connection and try again in Google Chrome."
                );

                return;

            }


            /* -----------------------------------------
               NO SPEECH
            ----------------------------------------- */

            if (
                event.error ===
                "no-speech"
            ) {

                console.log(
                    "No speech detected."
                );

                return;

            }


            /* -----------------------------------------
               ABORTED
            ----------------------------------------- */

            if (
                event.error ===
                "aborted"
            ) {

                console.log(
                    "Speech recognition temporarily stopped."
                );

                return;

            }

        };


    /* -----------------------------------------
       ON END
    ----------------------------------------- */

    recognition.onend =
        function () {

            recognitionStarting =
                false;


            console.log(
                "Speech recognition ended."
            );


            /*
             * Do NOT restart after network
             * or permission errors.
             */

            if (speechNetworkError) {

                isListening =
                    false;

                if (listeningStatus) {

                    listeningStatus.classList.add(
                        "hidden"
                    );

                }

                return;

            }


            /*
             * Restart only when user is
             * still answering.
             */

            if (
                isListening &&
                !interviewFinished
            ) {

                setTimeout(
                    function () {

                        if (
                            isListening &&
                            !interviewFinished &&
                            !speechNetworkError
                        ) {

                            startRecognition();

                        }

                    },
                    300
                );

            } else {

                if (listeningStatus) {

                    listeningStatus.classList.add(
                        "hidden"
                    );

                }

            }

        };

}


/* =====================================================
   INITIALIZE SPEECH
===================================================== */

setupSpeechRecognition();


/* =====================================================
   START RECOGNITION
===================================================== */

function startRecognition() {

    if (!recognition) {

        alert(
            "Voice recognition is not supported. Please use Google Chrome or Microsoft Edge."
        );

        return;

    }


    if (
        recognitionStarting ||
        isListening
    ) {

        return;

    }


    speechNetworkError =
        false;

    recognitionStarting =
        true;


    try {

        recognition.start();

        console.log(
            "Starting speech recognition..."
        );

    } catch (error) {

        recognitionStarting =
            false;

        console.warn(
            "Recognition start error:",
            error
        );

    }

}


/* =====================================================
   START ANSWER
===================================================== */

if (startAnswerBtn) {

    startAnswerBtn.addEventListener(
        "click",
        function () {

            if (!recognition) {

                alert(
                    "Voice recognition is not supported. Please use Chrome or Microsoft Edge."
                );

                return;

            }


            /*
             * Reset answer
             */

            transcriptText =
                "";

            interimTranscript =
                "";


            speechNetworkError =
                false;


            if (transcript) {

                transcript.innerHTML =
                    "";

            }


            if (wordCount) {

                wordCount.textContent =
                    "0 words";

            }


            startRecognition();

        }
    );

}


/* =====================================================
   STOP ANSWER
===================================================== */

if (stopAnswerBtn) {

    stopAnswerBtn.addEventListener(
        "click",
        function () {

            stopRecognition();

        }
    );

}


/* =====================================================
   STOP RECOGNITION
===================================================== */

function stopRecognition() {

    /*
     * IMPORTANT:
     * Set false BEFORE recognition.stop()
     * so onend doesn't restart it.
     */

    isListening =
        false;

    recognitionStarting =
        false;


    if (listeningStatus) {

        listeningStatus.classList.add(
            "hidden"
        );

    }


    if (startAnswerBtn) {

        startAnswerBtn.disabled =
            false;

    }


    if (stopAnswerBtn) {

        stopAnswerBtn.disabled =
            true;

    }


    /* -----------------------------------------
       SAVE INTERIM TEXT
    ----------------------------------------- */

    if (
        interimTranscript &&
        interimTranscript.trim()
    ) {

        transcriptText +=
            interimTranscript + " ";

    }


    interimTranscript =
        "";


    /* -----------------------------------------
       FINAL TEXT
    ----------------------------------------- */

    const finalText =
        transcriptText.trim();


    if (finalText) {

        if (transcript) {

            transcript.textContent =
                finalText;

        }


        updateWordCount(
            finalText
        );


        if (submitAnswerBtn) {

            submitAnswerBtn.disabled =
                false;

        }

    }


    /* -----------------------------------------
       STOP BROWSER RECOGNITION
    ----------------------------------------- */

    if (recognition) {

        try {

            recognition.stop();

        } catch (error) {

            console.log(
                "Recognition already stopped."
            );

        }

    }

}


/* =====================================================
   WORD COUNT
===================================================== */

function updateWordCount(text) {

    if (!wordCount) return;


    const cleanText =
        text.trim();


    const words =
        cleanText
            ? cleanText.split(/\s+/).length
            : 0;


    wordCount.textContent =
        `${words} words`;

}


/* =====================================================
   SUBMIT ANSWER
===================================================== */

if (submitAnswerBtn) {

    submitAnswerBtn.addEventListener(
        "click",
        submitAnswer
    );

}


async function submitAnswer() {

    /* -----------------------------------------
       SAVE INTERIM
    ----------------------------------------- */

    if (
        interimTranscript &&
        interimTranscript.trim()
    ) {

        transcriptText +=
            interimTranscript + " ";

        interimTranscript =
            "";

    }


    const finalAnswer =
        transcriptText.trim();


    if (!finalAnswer) {

        alert(
            "Please answer the question using your microphone."
        );

        return;

    }


    /* -----------------------------------------
       PREVENT DOUBLE SUBMIT
    ----------------------------------------- */

    submitAnswerBtn.disabled =
        true;


    stopTimer();

    stopRecognition();


    const list =
        questions[selectedCareer];


    const current =
        list[currentQuestion];


    /* -----------------------------------------
       SAVE ANSWER
    ----------------------------------------- */

    answers.push({

        question:
            current.question,

        category:
            current.category,

        difficulty:
            current.difficulty,

        answer:
            finalAnswer

    });


    console.log(
        "Saved answer:",
        finalAnswer
    );


    /* -----------------------------------------
       EVALUATING SCREEN
    ----------------------------------------- */

    if (interviewScreen) {

        interviewScreen.classList.add(
            "hidden"
        );

    }


    if (evaluatingScreen) {

        evaluatingScreen.classList.remove(
            "hidden"
        );

    }


    await new Promise(
        function (resolve) {

            setTimeout(
                resolve,
                1200
            );

        }
    );


    /* -----------------------------------------
       NEXT QUESTION
    ----------------------------------------- */

    if (
        currentQuestion <
        list.length - 1
    ) {

        currentQuestion++;


        if (evaluatingScreen) {

            evaluatingScreen.classList.add(
                "hidden"
            );

        }


        if (interviewScreen) {

            interviewScreen.classList.remove(
                "hidden"
            );

        }


        loadQuestion();


        setTimeout(
            function () {

                speakCurrentQuestion();

            },
            700
        );

    } else {

        await finishInterview();

    }

}


/* =====================================================
   SPEAK QUESTION
===================================================== */

if (speakQuestionBtn) {

    speakQuestionBtn.addEventListener(
        "click",
        speakCurrentQuestion
    );

}


function speakCurrentQuestion() {

    if (
        !window.speechSynthesis
    ) {

        alert(
            "Text-to-speech is not supported in this browser."
        );

        return;

    }


    const text =
        questionText
            ? questionText.textContent.trim()
            : "";


    if (!text) {

        return;

    }


    /*
     * Stop previous speech
     */

    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(
            text
        );


    speech.lang =
        "en-US";


    speech.rate =
        0.9;


    speech.pitch =
        1;


    speech.volume =
        1;


    window.speechSynthesis.speak(
        speech
    );

}


/* =====================================================
   FINISH INTERVIEW
===================================================== */

async function finishInterview() {

    interviewFinished =
        true;


    stopTimer();

    stopRecognition();


    /* -----------------------------------------
       STOP QUESTION SPEECH
    ----------------------------------------- */

    if (
        window.speechSynthesis
    ) {

        window.speechSynthesis.cancel();

    }


    /* -----------------------------------------
       STOP CAMERA + MICROPHONE
    ----------------------------------------- */

    if (stream) {

        stream
            .getTracks()
            .forEach(
                function (track) {

                    track.stop();

                }
            );

        stream =
            null;

    }


    /* -----------------------------------------
       BACKEND EVALUATION
    ----------------------------------------- */

    try {

        const response =
            await fetch(
                "/api/interview/evaluate",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        career:
                            selectedCareer,

                        answers:
                            answers

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Evaluation response:",
            data
        );


        showResults(
            data
        );

    } catch (error) {

        console.error(
            "Evaluation API error:",
            error
        );


        /*
         * Backend unavailable:
         * use local evaluation.
         */

        showResults(
            generateLocalEvaluation()
        );

    }

}


/* =====================================================
   FALLBACK EVALUATION
===================================================== */

function generateLocalEvaluation() {

    let totalWords =
        0;


    answers.forEach(
        function (answer) {

            if (
                answer.answer &&
                answer.answer.trim()
            ) {

                totalWords +=
                    answer.answer
                        .trim()
                        .split(/\s+/)
                        .length;

            }

        }
    );


    const averageWords =
        answers.length
            ? totalWords / answers.length
            : 0;


    let communication;


    if (
        averageWords > 120
    ) {

        communication =
            90;

    } else if (
        averageWords > 70
    ) {

        communication =
            82;

    } else if (
        averageWords > 35
    ) {

        communication =
            72;

    } else {

        communication =
            58;

    }


    const relevance =
        78;


    const technical =
        75;


    const confidence =
        80;


    const overall =
        Math.round(
            (
                communication +
                technical +
                relevance +
                confidence
            ) / 4
        );


    return {

        overall:
            overall,

        communication:
            communication,

        technical:
            technical,

        relevance:
            relevance,

        confidence:
            confidence,

        readiness:
            overall >= 85
                ? "INTERVIEW READY"
                : overall >= 70
                    ? "ALMOST READY"
                    : "NEEDS PRACTICE",

        strengths: [

            "You completed the complete interview.",

            "You attempted all interview questions.",

            "Your answers were evaluated for communication."

        ],

        improvements: [

            "Give more specific examples.",

            "Explain technical concepts with practical examples.",

            "Keep your answers structured and concise."

        ]

    };

}


/* =====================================================
   SHOW RESULTS
===================================================== */

function showResults(data) {

    data =
        data || {};


    /* -----------------------------------------
       SAFE VALUES
    ----------------------------------------- */

    data.overall =
        Number(data.overall) || 0;


    data.communication =
        Number(data.communication) || 0;


    data.technical =
        Number(data.technical) || 0;


    data.relevance =
        Number(data.relevance) || 0;


    data.confidence =
        Number(data.confidence) || 0;


    data.strengths =
        Array.isArray(data.strengths)
            ? data.strengths
            : [];


    data.improvements =
        Array.isArray(data.improvements)
            ? data.improvements
            : [];


    /* -----------------------------------------
       SCREEN
    ----------------------------------------- */

    if (evaluatingScreen) {

        evaluatingScreen.classList.add(
            "hidden"
        );

    }


    if (resultScreen) {

        resultScreen.classList.remove(
            "hidden"
        );

    }


    /* -----------------------------------------
       SCORE NUMBERS
    ----------------------------------------- */

    animateNumber(
        "overallScore",
        data.overall
    );


    animateNumber(
        "communicationScore",
        data.communication
    );


    animateNumber(
        "technicalScore",
        data.technical
    );


    animateNumber(
        "relevanceScore",
        data.relevance
    );


    animateNumber(
        "confidenceScore",
        data.confidence
    );


    /* -----------------------------------------
       READINESS
    ----------------------------------------- */

    const readinessBadge =
        document.getElementById(
            "readinessBadge"
        );


    if (readinessBadge) {

        readinessBadge.textContent =
            data.readiness ||
            "EVALUATED";

    }


    /* -----------------------------------------
       RESULT MESSAGE
    ----------------------------------------- */

    const resultMessage =
        document.getElementById(
            "resultMessage"
        );


    if (resultMessage) {

        resultMessage.textContent =
            `Your performance for ${selectedCareer} has been analysed.`;

    }


    /* -----------------------------------------
       PROGRESS BARS
    ----------------------------------------- */

    setBar(
        "communicationBar",
        data.communication
    );


    setBar(
        "technicalBar",
        data.technical
    );


    setBar(
        "relevanceBar",
        data.relevance
    );


    setBar(
        "confidenceBar",
        data.confidence
    );


    /* -----------------------------------------
       SCORE CIRCLE
    ----------------------------------------- */

    const circle =
        document.getElementById(
            "scoreProgress"
        );


    if (circle) {

        const circumference =
            427;


        circle.style.strokeDashoffset =
            circumference -
            (
                data.overall / 100
            ) *
            circumference;

    }


    /* -----------------------------------------
       STRENGTHS
    ----------------------------------------- */

    const strengths =
        document.getElementById(
            "strengthsList"
        );


    if (strengths) {

        strengths.innerHTML =
            "";


        data.strengths.forEach(
            function (item) {

                const li =
                    document.createElement(
                        "li"
                    );


                li.textContent =
                    item;


                strengths.appendChild(
                    li
                );

            }
        );

    }


    /* -----------------------------------------
       IMPROVEMENTS
    ----------------------------------------- */

    const improvements =
        document.getElementById(
            "improvementsList"
        );


    if (improvements) {

        improvements.innerHTML =
            "";


        data.improvements.forEach(
            function (item) {

                const li =
                    document.createElement(
                        "li"
                    );


                li.textContent =
                    item;


                improvements.appendChild(
                    li
                );

            }
        );

    }

}


/* =====================================================
   NUMBER ANIMATION
===================================================== */

function animateNumber(
    id,
    target
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    target =
        Number(target) || 0;


    let current =
        0;


    const increment =
        Math.max(
            1,
            Math.ceil(
                target / 50
            )
        );


    const interval =
        setInterval(
            function () {

                current +=
                    increment;


                if (
                    current >= target
                ) {

                    current =
                        target;


                    clearInterval(
                        interval
                    );

                }


                element.textContent =
                    current;

            },
            20
        );

}


/* =====================================================
   PROGRESS BAR
===================================================== */

function setBar(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    value =
        Math.max(
            0,
            Math.min(
                100,
                Number(value) || 0
            )
        );


    element.style.width =
        "0%";


    setTimeout(
        function () {

            element.style.width =
                value + "%";

        },
        200
    );

}


/* =====================================================
   PAGE CLEANUP
===================================================== */

window.addEventListener(
    "beforeunload",
    function () {

        interviewFinished =
            true;


        stopTimer();

        stopRecognition();


        /* -----------------------------------------
           STOP SPEECH
        ----------------------------------------- */

        if (
            window.speechSynthesis
        ) {

            window.speechSynthesis.cancel();

        }


        /* -----------------------------------------
           STOP CAMERA + MICROPHONE
        ----------------------------------------- */

        if (stream) {

            stream
                .getTracks()
                .forEach(
                    function (track) {

                        track.stop();

                    }
                );

        }

    }
);