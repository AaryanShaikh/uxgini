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

    if (os === "iOS" || os == "Windows") {
        // Select all divs with the 'extras' class
        const extrasDivs = document.querySelectorAll(".extras");
        extrasDivs.forEach(div => {
            div.remove(); // Remove the div
        });
    } else {
        // console.log("OS is not iOS, keeping the 'extras' divs.");
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


        const body = document.body;
        const bodyWidth = body.offsetWidth;

        // #region process words
        const processBlocks = document.querySelectorAll(".process-block")

        const wrapWords = (descElement) => {
            const textContent = descElement.innerText;
            const words = textContent.split(" ");
            descElement.innerHTML = words.map(word => `<span class="process-desc-word">${word}&nbsp;</span>`).join("");
        }

        const animateText = (descElement) => {
            anime({
                targets: descElement.querySelectorAll('.process-desc-word'),
                opacity: [0, 1],
                translateY: [20, 0],
                easing: 'easeOutExpo',
                animation: 50,
                delay: anime.stagger(20)
            });
        }

        processBlocks.forEach((block) => {
            const descElement = block.querySelector(".desc")
            wrapWords(descElement)

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === "class" && block.classList.contains("active")) {
                        animateText(descElement);
                    }
                });
            });

            observer.observe(block, { attributes: true });
        })

        if (bodyWidth < 700) {
            // #region projects
            const totalScrollHeight = document.querySelector(".projects-mobile").offsetHeight * 2;
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
            const totalScrollHeight = window.innerHeight * 2;
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
        gsap.from(".heading h1", { y: 70, opacity: 0, duration: 1, delay: 0.2 })
        gsap.from([".title h1"], { x: -70, opacity: 0, duration: 1, delay: 0.3, stagger: 0.1 })
        gsap.from(".hero-mob .title div", { opacity: 0, duration: 1, delay: .9 })
        gsap.from([".hero-mob .hero-desc h1", ".hero-mob .hero-desc p"], { x: 70, opacity: 0, duration: 1, delay: 0.5, stagger: 0.2 })
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
                angle:90,
                image1: imgs[0].getAttribute('src'),
                image2: imgs[1].getAttribute('src'),
                displacementImage: '../assets/disp.png'
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
        // gsap.to(".testimonials", {
        //     scrollTrigger: {
        //         trigger: ".testimonials",
        //         start: "top top",
        //         end: "+=10%",
        //         pin: true
        //     }
        // })
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
        testimonialPrevBtnMob.addEventListener("click", changeTestimonialBack);

        // #region Page Transition
        let project_btn = document.querySelector(".projects-link")
        let project_btn_mob = document.querySelector(".projects-link-mob")

        async function pageTransition() {
            gsap.to(".page-transition", {
                duration: 1,
                clipPath: 'circle(150% at 50% 100%)',
                ease: "expo.out",
                onComplete: () => {
                    window.location.href = 'projects.html';
                }
            })
        }

        project_btn.addEventListener("click", pageTransition)
        project_btn_mob.addEventListener("click", pageTransition)

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
                console.log("Please fill in all fields.");
                return;
            }

            // Email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                console.log("Please enter a valid email address.");
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
                        console.log("Form submitted successfully!");
                    } else {
                        console.log("Form submission failed.");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    console.log("There was an error submitting the form.");
                });
        });

        // #region hamburger
        let hamBtn = document.querySelector(".hamburger")
        let hamContainer = document.querySelector(".ham-container")
        hamBtn.addEventListener("click", () => {
            hamContainer.classList.toggle("show-menu");
            hamBtn.classList.toggle("is-active")
        })

        let navLinks = document.querySelectorAll(".mob-nav a");
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                hamContainer.classList.remove("show-menu"); // Ensure the menu closes
                hamBtn.classList.remove("is-active"); // Reset the hamburger icon state
            });
        });
    }

    // #region process

    const body = document.body;
    const bodyWidth = body.offsetWidth;

    if (bodyWidth < 700) {
        ScrollTrigger.normalizeScroll(true);
        gsap.from(".process-content-mob", {
            scrollTrigger: {
                trigger: ".process",
                start: "top top",
                pin: true,
                scrub: true,
                end: "+=250%",
                normalizeScroll: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const numTitles = 5;
                    const activeIndex = Math.floor(progress * numTitles);

                    document.querySelectorAll(".process-block").forEach((el, index) => {
                        el.classList.toggle("active", index === activeIndex);
                    });
                },
            },
            ease: "none",
        })
    } else {
        gsap.from(".process-content-mob", {
            scrollTrigger: {
                trigger: ".process",
                start: "top top",
                pin: true,
                scrub: true,
                end: "+=250%",
                onUpdate: (self) => {
                    const progress = self.progress;
                    const numTitles = 5;
                    const activeIndex = Math.floor(progress * numTitles);

                    document.querySelectorAll(".process-block").forEach((el, index) => {
                        el.classList.toggle("active", index === activeIndex);
                    });
                },
            },
            ease: "none",
        })
    }




    // Cleanup function to remove ScrollTrigger instances if necessary
    window.addEventListener("beforeunload", () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    });

});