// =====================================================
// GOOGLE SCRIPT URL
// =====================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbza7Y_jfPiGkA0hSQBC3TZJUQGUgaY1wnSbxTk0coGPu5IrBzl9pCAM28kOTM8fBYt9Mw/exec";


// =====================================================
// SEMUA SCRIPT DIJALANKAN SETELAH HTML SELESAI DIMUAT
// =====================================================

document.addEventListener("DOMContentLoaded", function () {


    // =================================================
    // COUNTDOWN PERNIKAHAN
    // =================================================

    const weddingDate =
        new Date("December 12, 2026 09:00:00").getTime();


    const daysElement =
        document.getElementById("days");

    const hoursElement =
        document.getElementById("hours");

    const minutesElement =
        document.getElementById("minutes");

    const secondsElement =
        document.getElementById("seconds");


    function updateCountdown() {

        if (
            !daysElement ||
            !hoursElement ||
            !minutesElement ||
            !secondsElement
        ) {
            return;
        }


        const now =
            new Date().getTime();


        const distance =
            weddingDate - now;


        // Jika waktu sudah habis
        if (distance <= 0) {

            daysElement.innerText = "0";
            hoursElement.innerText = "00";
            minutesElement.innerText = "00";
            secondsElement.innerText = "00";

            return;
        }


        // Hari
        const days =
            Math.floor(
                distance /
                (1000 * 60 * 60 * 24)
            );


        // Jam
        const hours =
            Math.floor(
                (distance /
                    (1000 * 60 * 60)) % 24
            );


        // Menit
        const minutes =
            Math.floor(
                (distance /
                    (1000 * 60)) % 60
            );


        // Detik
        const seconds =
            Math.floor(
                (distance / 1000) % 60
            );


        // Tampilkan
        daysElement.innerText =
            days;

        hoursElement.innerText =
            String(hours).padStart(2, "0");

        minutesElement.innerText =
            String(minutes).padStart(2, "0");

        secondsElement.innerText =
            String(seconds).padStart(2, "0");
    }


    // Jalankan pertama kali
    updateCountdown();


    // Update setiap 1 detik
    setInterval(
        updateCountdown,
        1000
    );



    // =================================================
    // WEDDING MUSIC
    // =================================================

    const music =
        document.getElementById(
            "weddingMusic"
        );


    const musicButton =
        document.getElementById(
            "musicButton"
        );


    if (
        music &&
        musicButton
    ) {

        musicButton.addEventListener(
            "click",
            function () {


                if (music.paused) {

                    music.play()
                        .then(function () {

                            musicButton.innerHTML =
                                "⏸ Pause Musik";

                        })
                        .catch(function (error) {

                            console.error(
                                "Musik gagal diputar:",
                                error
                            );

                        });


                } else {

                    music.pause();

                    musicButton.innerHTML =
                        "🎵 Putar Musik";

                }

            }
        );

    }



    // =================================================
    // RSVP
    // =================================================

    const rsvpForm =
        document.getElementById(
            "rsvpForm"
        );


    const rsvpSuccess =
        document.getElementById(
            "rsvpSuccess"
        );


    const messagesContainer =
        document.getElementById(
            "messagesContainer"
        );


    const guestCountGroup =
        document.getElementById(
            "guestCountGroup"
        );



    // =================================================
    // ESCAPE HTML
    // =================================================

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text || "";

        return div.innerHTML;
    }



    // =================================================
    // LOAD UCAPAN
    // =================================================

    function loadMessages() {

        if (!messagesContainer) {
            return;
        }


        const messages =
            JSON.parse(
                localStorage.getItem(
                    "weddingMessages"
                )
            ) || [];


        messagesContainer.innerHTML = "";


        if (messages.length === 0) {

            messagesContainer.innerHTML = `
                <div class="empty-message">
                    Belum ada ucapan.
                    Jadilah yang pertama memberikan doa ❤️
                </div>
            `;

            return;
        }


        messages.forEach(function (message) {

            const messageCard =
                document.createElement("div");


            messageCard.className =
                "message-card";


            messageCard.innerHTML = `

                <div class="message-top">

                    <span class="message-name">
                        ${escapeHTML(message.name)}
                    </span>

                    <span class="message-status">
                        ${escapeHTML(message.attendance)}
                    </span>

                </div>

                <p class="message-text">
                    ${escapeHTML(message.message)}
                </p>

            `;


            messagesContainer.appendChild(
                messageCard
            );

        });

    }



    // =================================================
    // RSVP SUBMIT
    // =================================================

    if (rsvpForm) {

        rsvpForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const name =
                    document
                        .getElementById("guestName")
                        ?.value
                        .trim();


                const attendance =
                    document.querySelector(
                        'input[name="attendance"]:checked'
                    );


                const guestCount =
                    document
                        .getElementById("guestCount")
                        ?.value;


                const message =
                    document
                        .getElementById("guestMessage")
                        ?.value
                        .trim();



                // =====================================
                // VALIDASI
                // =====================================

                if (
                    !name ||
                    !attendance ||
                    !message
                ) {

                    alert(
                        "Mohon lengkapi formulir terlebih dahulu."
                    );

                    return;
                }



                // =====================================
                // DATA RSVP
                // =====================================

                const newMessage = {

                    name: name,

                    attendance:
                        attendance.value,

                    guestCount:
                        guestCount || "",

                    message: message,

                    date:
                        new Date().toISOString()

                };



                // =====================================
                // SIMPAN KE WEBSITE
                // =====================================

                const messages =
                    JSON.parse(
                        localStorage.getItem(
                            "weddingMessages"
                        )
                    ) || [];


                messages.unshift(
                    newMessage
                );


                localStorage.setItem(
                    "weddingMessages",
                    JSON.stringify(messages)
                );



                // =====================================
                // KIRIM KE GOOGLE SHEETS
                // =====================================

                const formData =
                    new URLSearchParams();


                formData.append(
                    "name",
                    name
                );


                formData.append(
                    "attendance",
                    attendance.value
                );


                formData.append(
                    "guestCount",
                    guestCount || ""
                );


                formData.append(
                    "message",
                    message
                );



                try {

                    await fetch(
                        GOOGLE_SCRIPT_URL,
                        {
                            method: "POST",
                            body: formData,
                            mode: "no-cors"
                        }
                    );


                    console.log(
                        "RSVP dikirim ke Google Sheets."
                    );


                } catch (error) {

                    console.error(
                        "Gagal mengirim RSVP:",
                        error
                    );

                }



                // =====================================
                // RESET FORM
                // =====================================

                rsvpForm.reset();



                // =====================================
                // NOTIFIKASI
                // =====================================

                if (rsvpSuccess) {

                    rsvpSuccess.style.display =
                        "block";


                    setTimeout(
                        function () {

                            rsvpSuccess.style.display =
                                "none";

                        },
                        4000
                    );

                }



                // =====================================
                // UPDATE UCAPAN
                // =====================================

                loadMessages();

            }
        );

    }



    // =================================================
    // JUMLAH TAMU
    // =================================================

    const attendanceInputs =
        document.querySelectorAll(
            'input[name="attendance"]'
        );


    attendanceInputs.forEach(
        function (input) {

            input.addEventListener(
                "change",
                function () {

                    if (!guestCountGroup) {
                        return;
                    }


                    if (
                        this.value === "Hadir"
                    ) {

                        guestCountGroup.style.display =
                            "block";

                    } else {

                        guestCountGroup.style.display =
                            "none";

                    }

                }
            );

        }
    );



    // =================================================
    // LOAD UCAPAN SAAT WEBSITE DIBUKA
    // =================================================

    loadMessages();



    // =================================================
    // GALLERY
    // =================================================

    const galleryImages = [

        "images/gallery1.jpg",
        "images/gallery2.jpg"

    ];


    let currentGalleryIndex = 0;



    // =================================================
    // OPEN GALLERY
    // =================================================

    window.openGallery =
        function (source) {

            const modal =
                document.getElementById(
                    "galleryModal"
                );


            const modalImage =
                document.getElementById(
                    "galleryModalImage"
                );


            const counter =
                document.getElementById(
                    "galleryCounter"
                );


            if (
                !modal ||
                !modalImage
            ) {

                console.log(
                    "Gallery modal tidak ditemukan."
                );

                return;
            }



            // Bisa menerima index
            if (
                typeof source === "number"
            ) {

                currentGalleryIndex =
                    source;

            }


            // Bisa menerima gambar dari HTML
            else if (
                source &&
                source.tagName === "IMG"
            ) {

                const imageSrc =
                    source.getAttribute(
                        "src"
                    );


                const foundIndex =
                    galleryImages.indexOf(
                        imageSrc
                    );


                if (foundIndex !== -1) {

                    currentGalleryIndex =
                        foundIndex;

                }

            }



            // Tampilkan gambar
            modalImage.src =
                galleryImages[
                    currentGalleryIndex
                ];


            modalImage.alt =
                "Momen " +
                (
                    currentGalleryIndex + 1
                );



            if (counter) {

                counter.innerText =
                    (
                        currentGalleryIndex + 1
                    ) +
                    " / " +
                    galleryImages.length;

            }



            modal.classList.add(
                "active"
            );


            document.body.style.overflow =
                "hidden";

        };



    // =================================================
    // CLOSE GALLERY
    // =================================================

    window.closeGallery =
        function () {

            const modal =
                document.getElementById(
                    "galleryModal"
                );


            if (!modal) {
                return;
            }


            modal.classList.remove(
                "active"
            );


            document.body.style.overflow =
                "";

        };



    // =================================================
    // CHANGE GALLERY
    // =================================================

    window.changeGallery =
        function (direction) {


            currentGalleryIndex +=
                direction;


            if (
                currentGalleryIndex >=
                galleryImages.length
            ) {

                currentGalleryIndex = 0;

            }


            if (
                currentGalleryIndex < 0
            ) {

                currentGalleryIndex =
                    galleryImages.length - 1;

            }



            const modalImage =
                document.getElementById(
                    "galleryModalImage"
                );


            const counter =
                document.getElementById(
                    "galleryCounter"
                );


            if (modalImage) {

                modalImage.src =
                    galleryImages[
                        currentGalleryIndex
                    ];


                modalImage.alt =
                    "Momen " +
                    (
                        currentGalleryIndex + 1
                    );

            }


            if (counter) {

                counter.innerText =
                    (
                        currentGalleryIndex + 1
                    ) +
                    " / " +
                    galleryImages.length;

            }

        };



    // =================================================
    // KEYBOARD GALLERY
    // =================================================

    document.addEventListener(
        "keydown",
        function (event) {

            const modal =
                document.getElementById(
                    "galleryModal"
                );


            if (
                !modal ||
                !modal.classList.contains(
                    "active"
                )
            ) {

                return;

            }


            if (
                event.key === "Escape"
            ) {

                window.closeGallery();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                window.changeGallery(-1);

            }


            if (
                event.key === "ArrowRight"
            ) {

                window.changeGallery(1);

            }

        }
    );



    // =================================================
    // KLIK BACKGROUND MODAL
    // =================================================

    document.addEventListener(
        "click",
        function (event) {

            const modal =
                document.getElementById(
                    "galleryModal"
                );


            if (
                modal &&
                event.target === modal
            ) {

                window.closeGallery();

            }

        }
    );


});

// =================================
// SCROLL REVEAL ANIMATION
// =================================

document.addEventListener("DOMContentLoaded", function () {

    const animatedElements = document.querySelectorAll(
        ".scroll-reveal, .scroll-photo, .scroll-card"
    );

    const observer = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.15
        }
    );


    animatedElements.forEach(function (element) {

        observer.observe(element);

    });

});

// =================================
// WEDDING LOADING SCREEN
// =================================

window.addEventListener("load", function () {

    const weddingLoader =
        document.getElementById("weddingLoader");

    if (!weddingLoader) {
        return;
    }


    setTimeout(function () {

        weddingLoader.classList.add("hide");

    }, 1800);

});

// =================================
// LOVE STORY SCROLL ANIMATION
// =================================

document.addEventListener("DOMContentLoaded", function () {

    const timelineItems =
        document.querySelectorAll(".timeline-item");

    if (!timelineItems.length) {
        return;
    }


    const timelineObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                        timelineObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.2
            }
        );


    timelineItems.forEach(function (item) {

        timelineObserver.observe(item);

    });

});

// =================================
// WHATSAPP SHARE
// =================================

document.addEventListener("DOMContentLoaded", function () {

    const shareButton =
        document.getElementById("shareWhatsApp");


    if (!shareButton) {
        return;
    }


    shareButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const invitationURL =
                window.location.href;


            const message =
                "💌 Undangan Pernikahan Yoga & Hapsa\n\n" +

                "Dengan penuh kebahagiaan, " +
                "kami mengundang Anda untuk hadir " +
                "di hari istimewa kami.\n\n" +

                "📅 12 Desember 2026\n" +

                "📍 Gedung Sesat, Kota Metro\n\n" +

                "Silakan buka undangan kami:\n" +

                invitationURL;


            const whatsappURL =
                "https://wa.me/?text=" +
                encodeURIComponent(message);


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

});

// =================================
// ADD TO CALENDAR
// =================================

function addToCalendar() {

    const eventTitle =
        "Pernikahan Yoga & Hapsa";


    const eventDescription =
        "Akad Nikah dan Resepsi Yoga & Hapsa";


    const eventLocation =
        "Gedung Sesat, Kota Metro";


    // Waktu acara
    // 12 Desember 2026
    // Akad mulai 09:00
    // Selesai 14:00

    const startDate =
        "20261212T090000";

    const endDate =
        "20261212T140000";


    const googleCalendarURL =
        "https://calendar.google.com/calendar/render" +

        "?action=TEMPLATE" +

        "&text=" +
        encodeURIComponent(eventTitle) +

        "&dates=" +
        startDate +
        "/" +
        endDate +

        "&details=" +
        encodeURIComponent(eventDescription) +

        "&location=" +
        encodeURIComponent(eventLocation);


    window.open(
        googleCalendarURL,
        "_blank"
    );

}

// =====================================================
// PREMIUM SCROLL REVEAL
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const revealElements =
        document.querySelectorAll(
            ".scroll-reveal, .scroll-photo, .scroll-card"
        );


    if (!revealElements.length) {
        return;
    }


    const revealObserver =
        new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.15
            }
        );


    revealElements.forEach(function (element) {

        revealObserver.observe(element);

    });

});

// =====================================================
// BACK TO TOP
// =====================================================

const backToTop =
    document.getElementById("backToTop");


if (backToTop) {

    window.addEventListener("scroll", function () {

        if (window.scrollY > 500) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    });


    backToTop.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

