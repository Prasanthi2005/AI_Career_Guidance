document.addEventListener(
    "DOMContentLoaded",
    function() {

        const form =
            document.getElementById(
                "resumeForm"
            );

        const fileInput =
            document.getElementById(
                "resume"
            );

        const dropZone =
            document.getElementById(
                "dropZone"
            );

        const selectedFile =
            document.getElementById(
                "selectedFile"
            );

        const fileName =
            document.getElementById(
                "fileName"
            );

        const fileSize =
            document.getElementById(
                "fileSize"
            );

        const removeFile =
            document.getElementById(
                "removeFile"
            );

        const analyzeButton =
            document.getElementById(
                "analyzeButton"
            );

        const buttonText =
            document.getElementById(
                "buttonText"
            );

        const loadingBox =
            document.getElementById(
                "loadingBox"
            );


        // =================================================
        // FILE SIZE FORMAT
        // =================================================

        function formatFileSize(
            bytes
        ) {

            if (
                bytes === 0
            ) {

                return "0 KB";

            }

            const units = [
                "Bytes",
                "KB",
                "MB",
                "GB"
            ];

            const index =
                Math.floor(
                    Math.log(bytes) /
                    Math.log(1024)
                );

            const size =
                bytes /
                Math.pow(
                    1024,
                    index
                );

            return (
                size.toFixed(1) +
                " " +
                units[index]
            );
        }


        // =================================================
        // SHOW FILE
        // =================================================

        function showFile(
            file
        ) {

            if (!file) {

                return;

            }


            // PDF validation

            if (
                file.type !==
                "application/pdf" &&
                !file.name
                .toLowerCase()
                .endsWith(".pdf")
            ) {

                alert(
                    "Please select a PDF resume."
                );

                fileInput.value = "";

                return;

            }


            // File size validation
            // 10 MB maximum

            const maxSize =
                10 * 1024 * 1024;


            if (
                file.size > maxSize
            ) {

                alert(
                    "Resume must be smaller than 10 MB."
                );

                fileInput.value = "";

                return;

            }


            fileName.textContent =
                file.name;

            fileSize.textContent =
                formatFileSize(
                    file.size
                );


            selectedFile.style.display =
                "flex";


            dropZone.style.display =
                "none";
        }


        // =================================================
        // INPUT CHANGE
        // =================================================

        if (fileInput) {

            fileInput.addEventListener(
                "change",
                function() {

                    if (
                        this.files &&
                        this.files.length
                    ) {

                        showFile(
                            this.files[0]
                        );

                    }

                }
            );

        }


        // =================================================
        // REMOVE FILE
        // =================================================

        if (removeFile) {

            removeFile.addEventListener(
                "click",
                function() {

                    fileInput.value =
                        "";

                    selectedFile.style.display =
                        "none";

                    dropZone.style.display =
                        "flex";

                }
            );

        }


        // =================================================
        // DRAG ENTER
        // =================================================

        if (dropZone) {

            dropZone.addEventListener(
                "dragover",
                function(event) {

                    event.preventDefault();

                    dropZone.classList.add(
                        "dragging"
                    );

                }
            );


            dropZone.addEventListener(
                "dragleave",
                function() {

                    dropZone.classList.remove(
                        "dragging"
                    );

                }
            );


            dropZone.addEventListener(
                "drop",
                function(event) {

                    event.preventDefault();

                    dropZone.classList.remove(
                        "dragging"
                    );


                    const files =
                        event.dataTransfer.files;


                    if (
                        files &&
                        files.length
                    ) {

                        const file =
                            files[0];


                        // Assign dropped file
                        // to input

                        try {

                            const dataTransfer =
                                new DataTransfer();

                            dataTransfer.items.add(
                                file
                            );

                            fileInput.files =
                                dataTransfer.files;

                        } catch (error) {

                            console.log(
                                "DataTransfer error:",
                                error
                            );

                        }


                        showFile(
                            file
                        );

                    }

                }
            );

        }


        // =================================================
        // FORM SUBMIT
        // =================================================

        if (form) {

            form.addEventListener(
                "submit",
                function(event) {

                    if (!fileInput.files ||
                        !fileInput.files.length
                    ) {

                        event.preventDefault();

                        alert(
                            "Please select your resume PDF first."
                        );

                        return;

                    }


                    const file =
                        fileInput.files[0];


                    if (!file.name
                        .toLowerCase()
                        .endsWith(".pdf")
                    ) {

                        event.preventDefault();

                        alert(
                            "Only PDF resumes are allowed."
                        );

                        return;

                    }


                    // Disable button

                    analyzeButton.disabled =
                        true;


                    buttonText.textContent =
                        "Analyzing Resume...";


                    // Show loading

                    if (loadingBox) {

                        loadingBox.style.display =
                            "block";

                    }


                    // Scroll to loading

                    setTimeout(
                        function() {

                            loadingBox ? .scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                            });

                        },
                        100
                    );

                }
            );

        }

    }
);