// =========================================================
// AI CAREER GUIDANCE
// Dynamic Career Recommendation + Career Learning Roadmap
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Career Recommendation Page Loaded");


    // =====================================================
    // CAREER DATA
    // =====================================================

    const careerData = {

        "Software Developer": {
            description:
                "Build software applications, solve programming problems and develop reliable software systems.",

            skills: [
                "Python / Java",
                "Programming Fundamentals",
                "Object-Oriented Programming",
                "Data Structures & Algorithms",
                "SQL",
                "Git & GitHub",
                "REST APIs",
                "Problem Solving"
            ],

            roadmap: [
                ["Programming Fundamentals",
                    "Variables, data types, operators, conditions, loops, functions and problem solving."],

                ["Object-Oriented Programming",
                    "Classes, objects, inheritance, polymorphism, abstraction and encapsulation."],

                ["Data Structures",
                    "Arrays, strings, linked lists, stacks, queues, hash tables, trees and graphs."],

                ["Algorithms",
                    "Searching, sorting, recursion, time complexity and problem solving."],

                ["SQL & Databases",
                    "Tables, keys, CRUD, SELECT, JOIN, GROUP BY and database design."],

                ["Git & GitHub",
                    "Repositories, commits, branches, merge and pull requests."],

                ["REST APIs",
                    "HTTP, GET, POST, PUT, DELETE, JSON and authentication."],

                ["Backend Development",
                    "Learn Flask, Django, Spring Boot or Node.js."],

                ["Real-World Projects",
                    "Build task managers, authentication systems, e-commerce apps and portfolio projects."],

                ["Interview Preparation",
                    "DSA, coding problems, technical interviews and HR questions."]
            ]
        },


        "Frontend Developer": {
            description:
                "Create responsive, interactive and user-friendly websites and web applications.",

            skills: [
                "HTML",
                "CSS",
                "JavaScript",
                "Responsive Design",
                "DOM",
                "React",
                "REST APIs",
                "Git",
                "GitHub",
                "UI/UX Basics"
            ],

            roadmap: [
                ["HTML",
                    "Semantic HTML, forms, tables, links, images and page structure."],

                ["CSS",
                    "Selectors, box model, Flexbox, Grid, animations and responsive layouts."],

                ["JavaScript",
                    "Variables, functions, arrays, objects, loops, events and DOM manipulation."],

                ["Advanced JavaScript",
                    "Promises, async/await, fetch API, modules and error handling."],

                ["React",
                    "Components, props, state, hooks, routing and API integration."],

                ["REST APIs",
                    "HTTP requests, JSON and connecting frontend applications to backend APIs."],

                ["Git & GitHub",
                    "Version control, commits, branches and collaboration."],

                ["Frontend Projects",
                    "Build dashboards, portfolio websites, e-commerce interfaces and responsive apps."],

                ["Interview Preparation",
                    "HTML, CSS, JavaScript, React and frontend coding questions."]
            ]
        },


        "Backend Developer": {
            description:
                "Develop server-side applications, APIs, databases and backend systems.",

            skills: [
                "Python",
                "Flask / Django",
                "Node.js",
                "SQL",
                "Databases",
                "REST APIs",
                "Authentication",
                "Git & GitHub",
                "Testing",
                "Deployment"
            ],

            roadmap: [
                ["Programming Fundamentals",
                    "Python or JavaScript fundamentals, functions, loops and OOP."],

                ["Backend Framework",
                    "Learn Flask, Django or Node.js."],

                ["SQL",
                    "SELECT, INSERT, UPDATE, DELETE, JOIN and GROUP BY."],

                ["Databases",
                    "MySQL, PostgreSQL, MongoDB and database design."],

                ["REST APIs",
                    "GET, POST, PUT, DELETE, JSON and API architecture."],

                ["Authentication",
                    "Sessions, cookies, JWT, password hashing and authorization."],

                ["Testing",
                    "Unit testing, API testing, debugging and error handling."],

                ["Deployment",
                    "Deploy backend applications using cloud platforms."],

                ["Backend Projects",
                    "Build APIs, authentication systems and database applications."]
            ]
        },


        "Full Stack Developer": {
            description:
                "Build complete web applications using frontend, backend, databases and APIs.",

            skills: [
                "HTML",
                "CSS",
                "JavaScript",
                "React",
                "Python / Node.js",
                "Backend Development",
                "SQL",
                "REST APIs",
                "Git & GitHub",
                "Deployment"
            ],

            roadmap: [
                ["HTML & CSS",
                    "Web structure, forms, layouts, Flexbox, Grid and responsive design."],

                ["JavaScript",
                    "DOM, events, functions, arrays, objects and asynchronous programming."],

                ["React",
                    "Components, props, state, hooks, routing and API integration."],

                ["Backend Development",
                    "Flask, Django or Node.js, routes and authentication."],

                ["Databases",
                    "SQL, CRUD operations, joins and database integration."],

                ["REST APIs",
                    "API design, JSON, authentication and frontend-backend communication."],

                ["Git & GitHub",
                    "Version control, branches, pull requests and collaboration."],

                ["Deployment",
                    "Deploy frontend, backend and database applications."],

                ["Full Stack Projects",
                    "Build e-commerce, job portals and complete web applications."]
            ]
        },


        "Python Developer": {
            description:
                "Build applications and backend systems using Python and related technologies.",

            skills: [
                "Python",
                "OOP",
                "Data Structures",
                "Algorithms",
                "SQL",
                "Flask / Django",
                "REST APIs",
                "Git & GitHub",
                "Testing",
                "Deployment"
            ],

            roadmap: [
                ["Python Fundamentals",
                    "Variables, data types, conditions, loops, functions and modules."],

                ["Object-Oriented Python",
                    "Classes, objects, inheritance, polymorphism and encapsulation."],

                ["Data Structures & Algorithms",
                    "Lists, tuples, dictionaries, sets, stacks, queues, searching and sorting."],

                ["SQL",
                    "Queries, joins, CRUD operations and database design."],

                ["Flask / Django",
                    "Routes, templates, APIs, authentication and backend development."],

                ["Git & GitHub",
                    "Repositories, commits, branches and collaboration."],

                ["Testing",
                    "Unit testing, debugging and application testing."],

                ["Python Projects",
                    "Build automation tools, APIs and web applications."]
            ]
        },


        "Data Scientist": {
            description:
                "Use data, statistics and machine learning to discover insights and build predictive models.",

            skills: [
                "Python",
                "Statistics",
                "Probability",
                "NumPy",
                "Pandas",
                "Data Visualization",
                "SQL",
                "Machine Learning",
                "Scikit-learn",
                "Git & GitHub"
            ],

            roadmap: [
                ["Python for Data Science",
                    "Python fundamentals, functions, OOP and data handling."],

                ["Statistics",
                    "Mean, median, variance, distributions, correlation and hypothesis testing."],

                ["Probability",
                    "Probability rules, conditional probability and distributions."],

                ["NumPy & Pandas",
                    "Arrays, DataFrames, data cleaning and transformation."],

                ["Data Visualization",
                    "Matplotlib, charts and exploratory data analysis."],

                ["SQL",
                    "Queries, joins, aggregation and data extraction."],

                ["Machine Learning",
                    "Regression, classification, clustering and model evaluation."],

                ["Scikit-learn",
                    "Preprocessing, pipelines, training and evaluation."],

                ["Data Science Projects",
                    "Prediction, analytics and real-world datasets."]
            ]
        },


        "AI / Machine Learning Engineer": {
            description:
                "Build intelligent systems using machine learning, deep learning, AI and real-world data.",

            skills: [
                "Python",
                "NumPy",
                "Pandas",
                "Statistics",
                "Probability",
                "Linear Algebra",
                "Machine Learning",
                "Scikit-learn",
                "Deep Learning",
                "TensorFlow / PyTorch",
                "NLP",
                "Computer Vision",
                "Generative AI",
                "Git & GitHub",
                "Model Deployment"
            ],

            roadmap: [
                ["Python for AI",
                    "Python fundamentals, functions, OOP, NumPy and Pandas."],

                ["Mathematics",
                    "Probability, statistics, linear algebra and basic calculus."],

                ["Machine Learning",
                    "Regression, classification, clustering and model evaluation."],

                ["Scikit-learn",
                    "Preprocessing, model training, pipelines and evaluation."],

                ["Deep Learning",
                    "Neural networks, CNN, RNN and deep learning fundamentals."],

                ["NLP",
                    "Text processing, embeddings, sentiment analysis and language models."],

                ["Computer Vision",
                    "Image processing, classification, object detection and CNNs."],

                ["Generative AI",
                    "LLM fundamentals, prompting, embeddings, RAG and AI applications."],

                ["Model Deployment",
                    "Flask, FastAPI, REST APIs, Docker and cloud deployment."],

                ["AI Projects",
                    "Build prediction systems, chatbots and recommendation systems."]
            ]
        },


        "Cloud Engineer": {
            description:
                "Design, deploy and maintain scalable cloud infrastructure and applications.",

            skills: [
                "Linux",
                "Networking",
                "AWS / Azure / GCP",
                "Cloud Fundamentals",
                "Docker",
                "Kubernetes",
                "Git",
                "CI/CD",
                "Security",
                "Monitoring"
            ],

            roadmap: [
                ["Linux Fundamentals",
                    "Commands, files, permissions, processes and shell basics."],

                ["Networking",
                    "IP, DNS, HTTP, HTTPS, ports and networking fundamentals."],

                ["Cloud Fundamentals",
                    "Compute, storage, databases, networking and IAM."],

                ["AWS / Azure / GCP",
                    "Learn one major cloud platform and deploy applications."],

                ["Docker",
                    "Images, containers, Dockerfiles and container deployment."],

                ["Kubernetes",
                    "Containers, pods, deployments and services."],

                ["CI/CD",
                    "Automation, pipelines and continuous deployment."],

                ["Cloud Projects",
                    "Deploy applications and cloud infrastructure."]
            ]
        },


        "Data Analyst": {
            description:
                "Analyze business data and create insights, reports and dashboards for decision making.",

            skills: [
                "Excel",
                "SQL",
                "Python",
                "Pandas",
                "Statistics",
                "Data Cleaning",
                "Power BI",
                "Tableau",
                "Data Visualization",
                "Communication"
            ],

            roadmap: [
                ["Excel",
                    "Formulas, functions, pivot tables and data cleaning."],

                ["SQL",
                    "SELECT, WHERE, JOIN, GROUP BY and aggregations."],

                ["Statistics",
                    "Descriptive statistics, probability and correlation."],

                ["Python",
                    "Python fundamentals, Pandas and data manipulation."],

                ["Data Cleaning",
                    "Missing values, duplicates and transformations."],

                ["Data Visualization",
                    "Charts, dashboards and data storytelling."],

                ["Power BI / Tableau",
                    "Interactive dashboards and business reports."],

                ["Analytics Projects",
                    "Sales analysis, customer analysis and business dashboards."]
            ]
        },


        "Java Developer": {
            description:
                "Develop robust applications and backend systems using Java.",

            skills: [
                "Java",
                "OOP",
                "Data Structures & Algorithms",
                "SQL",
                "Spring Boot",
                "REST APIs",
                "Git & GitHub",
                "Testing",
                "Deployment"
            ],

            roadmap: [
                ["Java Fundamentals",
                    "Variables, data types, operators, conditions, loops and methods."],

                ["OOP in Java",
                    "Classes, objects, inheritance, interfaces and polymorphism."],

                ["Data Structures & Algorithms",
                    "Arrays, collections, stacks, queues, trees, sorting and searching."],

                ["SQL & Databases",
                    "Queries, joins, CRUD operations and relational databases."],

                ["Spring Boot",
                    "Controllers, services, repositories and backend development."],

                ["REST APIs",
                    "API architecture, JSON, HTTP methods and authentication."],

                ["Testing",
                    "Unit testing, integration testing and debugging."],

                ["Java Projects",
                    "Build enterprise applications, APIs and database-driven systems."]
            ]
        },
        "Database Developer": {

    description:
        "Design, develop and maintain databases, write efficient SQL queries and build reliable data systems.",

    skills: [
        "SQL",
        "MySQL",
        "PostgreSQL",
        "Database Design",
        "Relational Databases",
        "NoSQL",
        "MongoDB",
        "Database Administration",
        "Git & GitHub",
        "Data Security"
    ],

    roadmap: [

        [
            "SQL Fundamentals",
            "Learn SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY and filtering."
        ],

        [
            "Advanced SQL",
            "Learn JOIN, GROUP BY, HAVING, subqueries, CTEs and window functions."
        ],

        [
            "Database Design",
            "Learn tables, primary keys, foreign keys, relationships and normalization."
        ],

        [
            "MySQL / PostgreSQL",
            "Practice relational database development using MySQL or PostgreSQL."
        ],

        [
            "Database Programming",
            "Connect applications with databases using Python, Java or other programming languages."
        ],

        [
            "NoSQL Databases",
            "Learn MongoDB, documents, collections and basic NoSQL concepts."
        ],

        [
            "Database Administration",
            "Learn backups, indexing, performance optimization and database maintenance."
        ],

        [
            "Database Security",
            "Learn authentication, authorization, permissions and secure database access."
        ],

        [
            "Real-World Projects",
            "Build inventory systems, student management systems, job portals and e-commerce databases."
        ],

        [
            "Interview Preparation",
            "Practice SQL queries, database concepts, normalization, joins and database interview questions."
        ]

    ]

},
        

    };


    // =====================================================
    // USER SKILLS
    // IMPORTANT:
    // detected_skills comes from career.html
    // =====================================================
// =====================================================
// USER SKILLS FROM career.html
// =====================================================

const careerPage =
    document.getElementById("careerPage");

let detectedSkills = [];

if (careerPage) {

    try {

        const skillsData =
            careerPage.getAttribute("data-user-skills");

        detectedSkills =
            skillsData
                ? JSON.parse(skillsData)
                : [];

    } catch (error) {

        console.error(
            "Unable to read detected skills:",
            error
        );

        detectedSkills = [];

    }

}

console.log(
    "Resume skills received by Career JS:",
    detectedSkills
);


    // =====================================================
// SKILL NORMALIZATION
// =====================================================

function normalizeSkill(skill) {

    return String(skill || "")
        .toLowerCase()
        .trim()
        .replace(/[&/]/g, " ")
        .replace(/[-_]/g, " ")
        .replace(/[.,()]/g, "")
        .replace(/\s+/g, " ");

}


// =====================================================
// NORMALIZED USER SKILLS
// =====================================================

const normalizedUserSkills =
    detectedSkills
        .map(normalizeSkill)
        .filter(Boolean);

console.log(
    "Normalized Resume Skills:",
    normalizedUserSkills
);


// =====================================================
// SKILL ALIASES
// =====================================================

const skillAliases = {

    "python / java": [
        "python",
        "java"
    ],

    "flask / django": [
        "flask",
        "django"
    ],

    "tensorflow / pytorch": [
        "tensorflow",
        "pytorch"
    ],

    "git & github": [
        "git",
        "github",
        "git github"
    ],

    "rest apis": [
        "rest api",
        "rest apis"
    ],

    "sql & databases": [
        "sql",
        "mysql",
        "postgresql",
        "database",
        "databases"
    ],

    "python / node.js": [
        "python",
        "node",
        "nodejs",
        "node js"
    ],

    "aws / azure / gcp": [
        "aws",
        "azure",
        "gcp",
        "google cloud"
    ],

    "power bi / tableau": [
        "power bi",
        "tableau"
    ]

};


// =====================================================
// EXACT SKILL MATCH
// IMPORTANT:
// Do NOT use includes() between arbitrary skills.
// =====================================================

function hasMatchingSkill(requiredSkill) {

    const required =
        normalizeSkill(requiredSkill);


    if (!required) {
        return false;
    }


    // -------------------------------------------------
    // 1. Exact match
    // -------------------------------------------------

    if (normalizedUserSkills.includes(required)) {
        return true;
    }


    // -------------------------------------------------
    // 2. Alias match
    // -------------------------------------------------

    const aliases =
        skillAliases[requiredSkill.toLowerCase()];


    if (aliases) {

        return aliases.some(function (alias) {

            const normalizedAlias =
                normalizeSkill(alias);

            return normalizedUserSkills.includes(
                normalizedAlias
            );

        });

    }


    // -------------------------------------------------
    // 3. Controlled special matching
    // -------------------------------------------------

    if (
        required === "programming fundamentals"
    ) {

        return normalizedUserSkills.some(
            function (skill) {

                return [
                    "programming",
                    "programming fundamentals",
                    "python",
                    "java",
                    "javascript",
                    "c++",
                    "c#"
                ].includes(skill);

            }
        );

    }


    if (
        required === "object oriented programming"
    ) {

        return normalizedUserSkills.some(
            function (skill) {

                return [
                    "oop",
                    "object oriented programming",
                    "object oriented programming concepts",
                    "python oop",
                    "java oop"
                ].includes(skill);

            }
        );

    }


    if (
        required === "data structures"
    ) {

        return normalizedUserSkills.some(
            function (skill) {

                return [
                    "data structures",
                    "data structures and algorithms",
                    "dsa"
                ].includes(skill);

            }
        );

    }


    if (
        required === "data structures & algorithms"
    ) {

        return normalizedUserSkills.some(
            function (skill) {

                return [
                    "data structures and algorithms",
                    "dsa",
                    "algorithms"
                ].includes(skill);

            }
        );

    }


    if (
        required === "problem solving"
    ) {

        return normalizedUserSkills.some(
            function (skill) {

                return [
                    "problem solving",
                    "problem solving skills",
                    "dsa",
                    "algorithms"
                ].includes(skill);

            }
        );

    }


    return false;

}


// =====================================================
// GET EXISTING + MISSING SKILLS
// =====================================================

function getSkillStatus(requiredSkills) {

    const existing = [];
    const missing = [];


    requiredSkills.forEach(function (skill) {

        if (hasMatchingSkill(skill)) {

            existing.push(skill);

        } else {

            missing.push(skill);

        }

    });


    console.log(
        "Required Skills:",
        requiredSkills
    );

    console.log(
        "Existing Skills:",
        existing
    );

    console.log(
        "Missing Skills:",
        missing
    );


    return {

        existing: existing,

        missing: missing

    };

}


    // =====================================================
    // MODAL ELEMENTS
    // =====================================================

    const modal =
        document.getElementById("careerModal");

    const modalOverlay =
        document.getElementById("careerModalOverlay");

    const modalClose =
        document.getElementById("careerModalClose");

    const modalCareerName =
        document.getElementById("modalCareerName");

    const modalCareerDescription =
        document.getElementById("modalCareerDescription");

    const modalExistingSkills =
        document.getElementById("modalExistingSkills");

    const modalRequiredSkills =
        document.getElementById("modalRequiredSkills");

    const modalMissingSkills =
        document.getElementById("modalMissingSkills");

    const modalRoadmap =
        document.getElementById("modalRoadmap");

    const modalSelectCareer =
        document.getElementById("modalSelectCareer");

    const modalStartLearning =
        document.getElementById("modalStartLearning");


    let selectedCareer = null;


    // =====================================================
    // OPEN MODAL
    // =====================================================

    function openCareerModal(career) {

        if (!modal) {
            console.error("careerModal not found");
            return;
        }

        const data = careerData[career];

        if (!data) {
            console.error("Career data not found:", career);
            return;
        }

        selectedCareer = career;

        const status =
            getSkillStatus(data.skills);


        if (modalCareerName) {
            modalCareerName.textContent = career;
        }


        if (modalCareerDescription) {
            modalCareerDescription.textContent =
                data.description;
        }


        // Existing skills
        if (modalExistingSkills) {

            modalExistingSkills.innerHTML = "";

            if (status.existing.length === 0) {

                modalExistingSkills.innerHTML =
                    `<span class="modal-skill missing">
                        No matching skills detected
                    </span>`;

            } else {

                status.existing.forEach(function (skill) {

                    const element =
                        document.createElement("span");

                    element.className =
                        "modal-skill existing";

                    element.innerHTML =
                        `<i class="fa-solid fa-check"></i> ${skill}`;

                    modalExistingSkills.appendChild(element);

                });

            }

        }


        // Required skills
        if (modalRequiredSkills) {

            modalRequiredSkills.innerHTML = "";

            data.skills.forEach(function (skill) {

                const element =
                    document.createElement("span");

                element.className =
                    "modal-skill required";

                element.innerHTML =
                    `<i class="fa-solid fa-star"></i> ${skill}`;

                modalRequiredSkills.appendChild(element);

            });

        }


        // Missing skills
        if (modalMissingSkills) {

            modalMissingSkills.innerHTML = "";

            if (status.missing.length === 0) {

                modalMissingSkills.innerHTML =
                    `<span class="modal-skill existing">
                        <i class="fa-solid fa-circle-check"></i>
                        You already have all the main skills!
                    </span>`;

            } else {

                status.missing.forEach(function (skill) {

                    const element =
                        document.createElement("span");

                    element.className =
                        "modal-skill missing";

                    element.innerHTML =
                        `<i class="fa-solid fa-book"></i> ${skill}`;

                    modalMissingSkills.appendChild(element);

                });

            }

        }


        // Roadmap
        if (modalRoadmap) {

            modalRoadmap.innerHTML = "";

            data.roadmap.forEach(function (step, index) {

                const roadmapItem =
                    document.createElement("div");

                roadmapItem.className =
                    "roadmap-item";

                roadmapItem.innerHTML =
                    `<div class="roadmap-number">
                        ${index + 1}
                    </div>

                    <div class="roadmap-content">
                        <h4>${step[0]}</h4>
                        <p>${step[1]}</p>
                    </div>`;

                modalRoadmap.appendChild(roadmapItem);

            });

        }


        // COMPLETE CAREER COURSE
        if (modalStartLearning) {

            modalStartLearning.href =
                "/learning?career=" +
                encodeURIComponent(career);

        }


        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

    }


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    function closeCareerModal() {

        if (!modal) {
            return;
        }

        modal.classList.remove("active");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );

    }


    // =====================================================
    // OTHER CAREER OPTIONS
    // =====================================================

    const careerOptions =
        document.querySelectorAll(".career-option");


    careerOptions.forEach(function (option) {

        option.addEventListener(
            "click",
            function () {

                const career =
                    this.getAttribute("data-career");

                if (!career) {
                    console.warn(
                        "data-career missing"
                    );
                    return;
                }

                openCareerModal(career);

            }
        );

    });


    // =====================================================
    // CLOSE BUTTON
    // =====================================================

    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeCareerModal
        );

    }


    // =====================================================
    // OVERLAY
    // =====================================================

    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeCareerModal
        );

    }


    // =====================================================
    // ESC
    // =====================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal &&
                modal.classList.contains("active")
            ) {

                closeCareerModal();

            }

        }
    );


    // =====================================================
    // SELECT CAREER
    // =====================================================

    if (modalSelectCareer) {

        modalSelectCareer.addEventListener(
            "click",
            function () {

                if (!selectedCareer) {
                    return;
                }

                const input =
                    document.getElementById(
                        "targetCareerInput"
                    );

                const button =
                    document.getElementById(
                        "targetCareerButton"
                    );


                if (input) {
                    input.value =
                        selectedCareer;
                }


                if (button) {

                    button.innerHTML =
                        `<i class="fa-solid fa-check"></i>
                         Selected: ${selectedCareer}`;

                }


                closeCareerModal();


                const targetBox =
                    document.querySelector(
                        ".target-career-box"
                    );


                if (targetBox) {

                    targetBox.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

            }
        );

    }


    // =====================================================
    // REVEAL CARDS
    // =====================================================

    const cards =
        document.querySelectorAll(
            ".section-card, " +
            ".summary-card, " +
            ".recommended-card, " +
            ".next-steps, " +
            ".target-career-box"
        );


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            entry.target.style.opacity = "1";

                            entry.target.style.transform =
                                "translateY(0)";

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        cards.forEach(function (card) {

            card.style.opacity = "0";

            card.style.transform =
                "translateY(25px)";

            card.style.transition =
                "opacity 0.7s ease, transform 0.7s ease";

            observer.observe(card);

        });

    } else {

        cards.forEach(function (card) {

            card.style.opacity = "1";

            card.style.transform =
                "translateY(0)";

        });

    }


    // =====================================================
    // SKILL TAG ANIMATION
    // =====================================================

    const skillTags =
        document.querySelectorAll(".skill-tag");


    skillTags.forEach(function (tag, index) {

        tag.style.animationDelay =
            (index * 0.05) + "s";


        tag.addEventListener(
            "mouseenter",
            function () {

                this.style.transform =
                    "translateY(-4px) scale(1.04)";

            }
        );


        tag.addEventListener(
            "mouseleave",
            function () {

                this.style.transform =
                    "translateY(0) scale(1)";

            }
        );

    });


    // =====================================================
    // BUTTON EFFECT
    // =====================================================

    const buttons =
        document.querySelectorAll(
            ".action-btn, " +
            ".primary-btn, " +
            ".modal-select-btn, " +
            ".modal-learning-btn"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                this.style.transform =
                    "scale(0.96)";

                setTimeout(function () {

                    button.style.transform = "";

                }, 150);

            }
        );

    });


    // =====================================================
    // RESUME SCORE
    // =====================================================

    const scoreElement =
        document.querySelector(
            ".summary-card strong"
        );


    if (scoreElement) {

        const target =
            parseInt(
                scoreElement.textContent
                    .replace("%", "")
                    .trim(),
                10
            );


        if (!isNaN(target)) {

            let current = 0;

            const duration = 1200;

            const intervalTime = 20;

            const increment =
                target /
                (duration / intervalTime);


            const counter =
                setInterval(function () {

                    current += increment;

                    if (current >= target) {

                        current = target;

                        clearInterval(counter);

                    }

                    scoreElement.textContent =
                        Math.floor(current) + "%";

                }, intervalTime);

        }

    }


    // =====================================================
    // RECOMMENDED CARD EFFECT
    // =====================================================

    const recommended =
        document.querySelector(
            ".recommended-card"
        );


    if (recommended) {

        recommended.addEventListener(
            "mousemove",
            function (event) {

                const rect =
                    this.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const rotateX =
                    ((y / rect.height) - 0.5) * -4;

                const rotateY =
                    ((x / rect.width) - 0.5) * 4;

                this.style.transform =
                    "perspective(900px) " +
                    "rotateX(" + rotateX + "deg) " +
                    "rotateY(" + rotateY + "deg) " +
                    "translateY(-2px)";

            }
        );


        recommended.addEventListener(
            "mouseleave",
            function () {

                this.style.transform =
                    "perspective(900px) " +
                    "rotateX(0) " +
                    "rotateY(0)";

            }
        );

    }


    console.log(
        "Career data loaded:",
        Object.keys(careerData)
    );

});