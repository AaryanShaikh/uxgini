// Save the "siteVisited" flag when the site is visited
window.addEventListener('load', () => {
    localStorage.setItem('siteVisited', 'true'); // Site visited flag
    localStorage.setItem('navigatingWithinSite', 'false'); // Track internal navigation
});

// // Track internal navigation on link clicks
// document.querySelectorAll('a').forEach(link => {
//     link.addEventListener('click', () => {
//         // Set navigation flag to true for internal links
//         const isInternal = link.href.startsWith(window.location.origin);
//         if (isInternal) {
//             localStorage.setItem('navigatingWithinSite', 'true');
//         }
//     });
// });
document.querySelector(".projects-link").addEventListener("click", () => {
    localStorage.setItem('navigatingWithinSite', 'true');
})

// Handle tab closing
window.addEventListener('beforeunload', () => {
    const isNavigating = localStorage.getItem('navigatingWithinSite') === 'true';

    // If not navigating within the site, remove the siteVisited flag
    if (!isNavigating) {
        localStorage.removeItem('siteVisited');
    }

    // Always clear the navigating flag
    localStorage.removeItem('navigatingWithinSite');
});

// Function to detect the OS
function getOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Check for iOS
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    // Check for Windows
    if (/Windows/.test(userAgent)) {
        return "Windows";
    }

    // Check for Android
    if (/Android/.test(userAgent)) {
        return "Android";
    }

    return "Other";
}

// Function to remove divs with class 'extras' if OS is iOS
function handleExtras() {
    const os = getOS();

    if (os === "iOS"||os=="Windows") {
        // Select all divs with the 'extras' class
        const extrasDivs = document.querySelectorAll(".extras");
        extrasDivs.forEach(div => {
            div.remove(); // Remove the div
        });
    } else {
        console.log("OS is not iOS, keeping the 'extras' divs.");
    }
}

document.addEventListener("DOMContentLoaded", function () {

    // console.log("localstorage", localStorage.getItem("siteVisited"));

    // #region Loading
    setTimeout(() => {
        document.querySelector(".desktop-content").style.display = "block"
        document.querySelector(".loading-center").style.display = "none"
        document.getElementById("pointer-ring").style.opacity = 1
        handleExtras()
        exeCode()
    }, localStorage.getItem("siteVisited") == null ? 8010 : 10) // 8010

    function exeCode() {
        gsap.registerPlugin(ScrollTrigger, TextPlugin);

        // #region Smooth scroll
        const lenis = new Lenis();
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // #region projects
        const body = document.body;
        const bodyWidth = body.offsetWidth;

        if (bodyWidth < 700) {
            const totalScrollHeight = document.querySelector(".projects-mobile").offsetHeight * 4;
            const cards = document.querySelector(".cards-mobile");
            const totalScrollWidth = cards.scrollWidth - document.querySelector(".projects-mobile").offsetWidth;

            gsap.to(cards, {
                x: -totalScrollWidth, // scroll to the end of the container
                ease: "none", // no easing for a linear scroll effect
                scrollTrigger: {
                    trigger: cards,
                    start: "top top",
                    end: () => `+=${totalScrollHeight}`, // total vertical scroll distance
                    scrub: true,
                    pin: true,
                    pinSpacing: true
                },
            });
        } else {
            const totalScrollHeight = window.innerHeight * 4;
            const cards = document.querySelector(".cards");
            const totalScrollWidth = cards.scrollWidth - window.innerWidth;

            gsap.to(cards, {
                x: -totalScrollWidth, // scroll to the end of the container
                ease: "none", // no easing for a linear scroll effect
                scrollTrigger: {
                    trigger: cards,
                    start: "top top",
                    end: () => `+=${totalScrollHeight}`, // total vertical scroll distance
                    scrub: true,
                    pin: true,
                    pinSpacing: true
                },
            });
        }



        // #region Hero section
        gsap.from(".txt-uxgini", { y: 70, opacity: 0, duration: 1, delay: 0.2 })
        gsap.from([".namaste", ".hero-left-column"], { x: -70, opacity: 0, duration: 1, delay: 0.3, stagger: 0.1 })
        gsap.from(".lets-talk-btn", { opacity: 0, duration: 1, delay: 1.4 })
        gsap.from(".hero-right-column", { x: 70, opacity: 0, duration: 1, delay: 0.5 })
        gsap.from(".header-nav-list-item", { y: 70, opacity: 0, duration: 1, delay: 0.5, stagger: 0.2 })
        gsap.from(".header-request-btn", { y: 50, opacity: 0, duration: 1, delay: 0.5 })
        gsap.from(".hero-img", { opacity: 0, duration: 1, delay: 0.5 })
        gsap.from(".hero-container", { backgroundSize: 0, duration: .5, })

        // #region Hero Img

        Array.from(document.querySelectorAll('.hero-img')).forEach((e) => {
            const imgs = Array.from(e.querySelectorAll('img'));
            new hoverEffect({
                parent: e,
                intensity1: 0.2,
                intensity2: 0.1,
                image1: imgs[0].getAttribute('src'),
                image2: imgs[1].getAttribute('src'),
                displacementImage: '../assets/displacement.png'
            });
        })

        // #region reveals
        gsap.from('.process-heading', {
            scrollTrigger: {
                trigger: ".process-heading",
                start: "top bottom",
                once: true
            },
            y: 100,
            opacity: 0,
            duration: 1
        });
        gsap.from('.about', {
            scrollTrigger: {
                trigger: ".about",
                start: "top bottom",
                once: true
            },
            y: 100,
            opacity: 0,
            duration: 1
        });

        // #region testimonials
        gsap.to(".testimonials", {
            scrollTrigger: {
                trigger: ".testimonials",
                start: "top top",
                end: "+=50%",
                pin: true
            }
        })
        let isplaying = false;
        let btn = document.querySelector(".play-button");
        let video = document.querySelector("#testimonial-video");
        let videoUrl = document.querySelector("#testimonial-video-url");
        let testimonialNxtBtn = document.querySelector("#testimonial-next-btn");
        let testimonialPrevBtn = document.querySelector("#testimonial-prev-btn");
        let testimonialNxtBtnMob = document.querySelector("#testimonial-next-btn-mob");
        let testimonialPrevBtnMob = document.querySelector("#testimonial-prev-btn-mob");
        let currTestimonial = 0;
        let allTestimonials = [
            "../assets/test1.mp4",
            "../assets/test2.mp4",
            "../assets/test3.mp4",
        ];
        let allTestimonialsName = [
            { name: "Sairaj Ghadge.", work: "Musician at Rhythm and Souls" },
            { name: "Ruben Rodrigues.", work: "Food Blooger aka Mr. Kurkurit" },
            { name: "Chirag Warang.", work: "Member of Arena Animation Goa" },
        ];

        btn.addEventListener("click", () => {
            if (isplaying) {
                video.pause();
                isplaying = false;
                document.querySelectorAll(".testimonial-btn").forEach((el, index) => {
                    el.classList.toggle("btn-active", index === 1);
                });
            } else {
                video.play();
                isplaying = true;
                document.querySelectorAll(".testimonial-btn").forEach((el, index) => {
                    el.classList.toggle("btn-active", index === 0);
                });
            }
        });

        function changeTestimonial() {
            console.log("i was called");

            currTestimonial = (currTestimonial + 1) % allTestimonials.length;
            videoUrl.src = allTestimonials[currTestimonial];
            videoUrl.parentElement.load();
            isplaying = false
            document.querySelectorAll(".testimonial-btn").forEach((el, index) => {
                el.classList.toggle("btn-active", index === 1);
            });
            document.querySelectorAll(".testimonial-description").forEach((el, index) => {
                el.classList.toggle("testimonial-active", index === currTestimonial);
            });
            gsap.to(".testimonial-name", {
                duration: 1,
                text: {
                    value: allTestimonialsName[currTestimonial].name,
                }
            })
            gsap.to(".testimonial-work", {
                duration: 1,
                text: {
                    value: allTestimonialsName[currTestimonial].work,
                }
            })
        }

        testimonialNxtBtn.addEventListener("click", changeTestimonial);
        testimonialNxtBtnMob.addEventListener("touchstart", changeTestimonial, { capture: true });
        testimonialNxtBtnMob.addEventListener("click", changeTestimonial);

        function changeTestimonialBack() {
            currTestimonial =
                (currTestimonial - 1 + allTestimonials.length) % allTestimonials.length;
            videoUrl.src = allTestimonials[currTestimonial];
            videoUrl.parentElement.load();
            isplaying = false
            document.querySelectorAll(".testimonial-btn").forEach((el, index) => {
                el.classList.toggle("btn-active", index === 1);
            });
            document.querySelectorAll(".testimonial-description").forEach((el, index) => {
                el.classList.toggle("testimonial-active", index === currTestimonial);
            });
            gsap.to(".testimonial-name", {
                duration: 1,
                text: {
                    value: allTestimonialsName[currTestimonial].name,
                }
            })
            gsap.to(".testimonial-work", {
                duration: 1,
                text: {
                    value: allTestimonialsName[currTestimonial].work,
                }
            })
        }

        testimonialPrevBtn.addEventListener("click", changeTestimonialBack);
        testimonialPrevBtnMob.addEventListener("touchstart", changeTestimonialBack, { capture: true });
        testimonialPrevBtnMob.addEventListener("click", changeTestimonialBack);

        // #region Page Transition
        let project_btn = document.querySelector(".projects-link")

        project_btn.addEventListener("click", async () => {
            gsap.to(".page-transition", {
                duration: 2,
                clipPath: 'circle(150% at 50% 100%)',
                ease: "expo.out",
                onComplete: () => {
                    window.location.href = 'projects.html';
                }
            })
        })

        // #region contact form
        const formspreeURL = "https://formspree.io/f/xgvezekb";
        let contactBtn = document.querySelector("#contact-btn");

        contactBtn.addEventListener("click", (e) => {
            e.preventDefault();

            // Collect data from input fields
            const name = document.querySelector("#name").value.trim();
            const email = document.querySelector("#email").value.trim();
            const message = document.querySelector("#message").value.trim();

            // Basic validation
            if (!name || !email || !message) {
                alert("Please fill in all fields.");
                return;
            }

            // Email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            // Data to send to Formspree
            const formData = { name, email, message };

            // Send the data to Formspree
            fetch(formspreeURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Form submitted successfully!");
                    } else {
                        alert("Form submission failed.");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("There was an error submitting the form.");
                });
        });
    }

    // #region process

    const body = document.body;
    const bodyWidth = body.offsetWidth;

    if (bodyWidth < 700) {
        ScrollTrigger.normalizeScroll(true);
        gsap.from(".process-content-progress", {
            scrollTrigger: {
                trigger: ".process",
                start: "top top",
                pin: true,
                scrub: true,
                end: "+=150%",
                normalizeScroll: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const numTitles = 5;
                    const activeIndex = Math.floor(progress * numTitles);

                    document.querySelectorAll(".process-content-title > div").forEach((el, index) => {
                        el.classList.toggle("active", index === activeIndex);
                    });
                    document.querySelectorAll(".process-content-description-text").forEach((el, index) => {
                        el.classList.toggle("text-active", index === activeIndex);
                    });

                },
                onLeave: () => {
                    document.querySelector(".process-content-progress").style.opacity = 0
                },
                onEnterBack: () => {
                    document.querySelector(".process-content-progress").style.opacity = 1
                }
            },
            scaleX: 0,
            ease: "none",
            transformOrigin: "left center",
        })
    } else {
        gsap.from(".process-content-progress", {
            scrollTrigger: {
                trigger: ".process",
                start: "top top",
                pin: true,
                scrub: true,
                end: "+=200%",
                onUpdate: (self) => {
                    const progress = self.progress;
                    const numTitles = 5;
                    const activeIndex = Math.floor(progress * numTitles);

                    document.querySelectorAll(".process-content-title > div").forEach((el, index) => {
                        el.classList.toggle("active", index === activeIndex);
                    });
                    document.querySelectorAll(".process-content-description-text").forEach((el, index) => {
                        el.classList.toggle("text-active", index === activeIndex);
                    });

                },
                onLeave: () => {
                    document.querySelector(".process-content-progress").style.opacity = 0
                },
                onEnterBack: () => {
                    document.querySelector(".process-content-progress").style.opacity = 1
                }
            },
            scaleY: 0,
            ease: "none",
            transformOrigin: "top center",
        })
    }




    // Cleanup function to remove ScrollTrigger instances if necessary
    window.addEventListener("beforeunload", () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    });

});