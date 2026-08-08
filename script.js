// =====================================================
// SCRIPT.JS - UNDANGAN YOGA & HAPSA
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // =================================================
    // COUNTDOWN
    // =================================================

    const weddingDate = new Date("December 12, 2026 09:00:00").getTime();

    const days = document.getElementById("days");
    const hours = document.getElementById("hours");
    const minutes = document.getElementById("minutes");
    const seconds = document.getElementById("seconds");

    function updateCountdown() {

        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance <= 0) {
            if (days) days.textContent = "0";
            if (hours) hours.textContent = "00";
            if (minutes) minutes.textContent = "00";
            if (seconds) seconds.textContent = "00";
            return;
        }

        const d = Math.floor(
            distance / (1000 * 60 * 60 * 24)
        );

        const h = Math.floor(
            (distance / (1000 * 60 * 60)) % 24
        );

        const m = Math.floor(
            (distance / (1000 * 60)) % 60
        );

        const s = Math.floor(
            (distance / 1000) % 60
        );

        if (days) days.textContent = d;
        if (hours) hours.textContent = String(h).padStart(2, "0");
        if (minutes) minutes.textContent = String(m).padStart(2, "0");
        if (seconds) seconds.textContent = String(s).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    // =================================================
    // MUSIK
    // =================================================

    const music = document.getElementById("weddingMusic");
    const musicButton = document.getElementById("musicButton");

    if (music && musicButton) {

        musicButton.addEventListener("click", function () {

            if (music.paused) {

                music.play()
                    .then(function () {
                        musicButton.textContent = "⏸ Pause Musik";
                    })
                    .catch(function (error) {
                        console.log("Musik belum bisa diputar:", error);
                    });

            } else {

                music.pause();
                musicButton.textContent = "🎵 Putar Musik";

            }

        });

    }


    // =================================================
    // SCROLL REVEAL
    // =================================================

    const revealElements = document.querySelectorAll(
        ".scroll-reveal, .scroll-photo, .scroll-card, .timeline-item"
    );

    if ("IntersectionObserver" in window) {

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

        revealElements.forEach(function (element) {
            observer.observe(element);
        });

    } else {

        revealElements.forEach(function (element) {
            element.classList.add("show");
        });

    }


    // =================================================
    // BACK TO TOP
    // =================================================

    const backToTop = document.getElementById("backToTop");

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


    // =================================================
    // WHATSAPP SHARE
    // =================================================

    const shareButton = document.getElementById("shareWhatsApp");

    if (shareButton) {

        shareButton.addEventListener("click", function (event) {

            event.preventDefault();

            const invitationURL = window.location.href;

            const message =
                "💌 Undangan Pernikahan Yoga & Hapsa\n\n" +
                "Dengan penuh kebahagiaan, kami mengundang Anda " +
                "untuk hadir di hari istimewa kami.\n\n" +
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

        });

    }


    // =================================================
    // GALLERY
    // =================================================

    const galleryImages = [
        "images/gallery1.jpg",
        "images/gallery2.jpg"
    ];

    let currentGalleryIndex = 0;

    window.openGallery = function (index) {

        const modal = document.getElementById("galleryModal");
        const modalImage = document.getElementById("galleryModalImage");
        const counter = document.getElementById("galleryCounter");

        if (!modal || !modalImage) {
            return;
        }

        currentGalleryIndex = index;

        modalImage.src = galleryImages[currentGalleryIndex];

        if (counter) {
            counter.textContent =
                (currentGalleryIndex + 1) +
                " / " +
                galleryImages.length;
        }

        modal.classList.add("active");

        document.body.style.overflow = "hidden";

    };


    window.closeGallery = function () {

        const modal = document.getElementById("galleryModal");

        if (!modal) {
            return;
        }

        modal.classList.remove("active");

        document.body.style.overflow = "";

    };


    window.changeGallery = function (direction) {

        currentGalleryIndex += direction;

        if (currentGalleryIndex >= galleryImages.length) {
            currentGalleryIndex = 0;
        }

        if (currentGalleryIndex < 0) {
            currentGalleryIndex = galleryImages.length - 1;
        }

        const modalImage =
            document.getElementById("galleryModalImage");

        const counter =
            document.getElementById("galleryCounter");

        if (modalImage) {
            modalImage.src =
                galleryImages[currentGalleryIndex];
        }

        if (counter) {
            counter.textContent =
                (currentGalleryIndex + 1) +
                " / " +
                galleryImages.length;
        }

    };


    // =================================================
    // CLOSE GALLERY DENGAN ESC
    // =================================================

    document.addEventListener("keydown", function (event) {

        const modal = document.getElementById("galleryModal");

        if (!modal || !modal.classList.contains("active")) {
            return;
        }

        if (event.key === "Escape") {
            window.closeGallery();
        }

        if (event.key === "ArrowRight") {
            window.changeGallery(1);
        }

        if (event.key === "ArrowLeft") {
            window.changeGallery(-1);
        }

    });


    // =================================================
    // KLIK BACKGROUND GALLERY
    // =================================================

    const galleryModal = document.getElementById("galleryModal");

    if (galleryModal) {

        galleryModal.addEventListener("click", function (event) {

            if (event.target === galleryModal) {
                window.closeGallery();
            }

        });

    }


    // =================================================
    // ADD TO GOOGLE CALENDAR
    // =================================================

    const calendarButton =
        document.getElementById("calendarButton");

    if (calendarButton) {

        calendarButton.addEventListener("click", function () {

            const title =
                "Pernikahan Yoga & Hapsa";

            const description =
                "Akad Nikah dan Resepsi Yoga & Hapsa";

            const location =
                "Gedung Sesat, Kota Metro";

            const start =
                "20261212T090000";

            const end =
                "20261212T140000";

            const calendarURL =
                "https://calendar.google.com/calendar/render" +
                "?action=TEMPLATE" +
                "&text=" + encodeURIComponent(title) +
                "&dates=" + start + "/" + end +
                "&details=" + encodeURIComponent(description) +
                "&location=" + encodeURIComponent(location);

            window.open(calendarURL, "_blank");

        });

    }

});


// =====================================================
// LOADING SCREEN
// =====================================================

window.addEventListener("load", function () {

    const loader =
        document.getElementById("weddingLoader");

    if (!loader) {
        return;
    }

    setTimeout(function () {

        loader.classList.add("hide");

    }, 1200);

});
