// Save the "siteVisited" flag when the site is visited
window.addEventListener('load', () => {
    localStorage.setItem('siteVisited', 'true'); // Site visited flag
    localStorage.setItem('navigatingWithinSite', 'false'); // Track internal navigation
});

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

function checkWidthAndReload() {
    if (document.body.clientWidth < 800) {
        location.reload();
    }
}

window.addEventListener('resize', checkWidthAndReload);

document.addEventListener("DOMContentLoaded", function () {

    // console.log("localstorage", localStorage.getItem("siteVisited"));

    // #region Loading
    setTimeout(() => {
        document.querySelector(".desktop-content").style.display = "block"
        document.querySelector(".loading-center").style.display = "none"
        document.getElementById("pointer-ring").style.opacity = 1
        handleExtras()
        exeCode()
        splitText(".process-heading", ".about-title", ".contact-header", ".bonus-header")
    }, localStorage.getItem("siteVisited") == null ? 3010 : 10)

    function splitText(...targets) {
        targets.forEach((target) => {
            const headline = document.querySelector(target);
            const text = headline.textContent;
            headline.innerHTML = '';

            text.trim().split('').forEach(char => {
                const span = document.createElement('span');
                if (char === ' ') {
                    const space = document.createElement('span');
                    space.classList.add('space');
                    headline.appendChild(space);
                } else {
                    span.textContent = char;
                    headline.appendChild(span);
                }
            });

            gsap.from(`${target} span`, {
                y: 100,
                opacity: 0,
                duration: 1.3,
                stagger: 0.05,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: target,
                    start: 'top 80%',
                    once: true,
                },
            });
        })

    }

    function exeCode() {
        gsap.registerPlugin(ScrollTrigger, TextPlugin);

        // #region Smooth scroll
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
            direction: 'vertical', // vertical, horizontal
            gestureDirection: 'vertical', // vertical, horizontal, both
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        })
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
            const totalScrollHeight = document.querySelector(".projects-mobile").offsetHeight * 3;
            const cards = document.querySelector(".cards-mobile");
            const totalScrollWidth = cards.scrollWidth - document.querySelector(".projects-mobile").offsetWidth;

            const updateObjectPosition = (progress) => {
                const images = cards.querySelectorAll("img");  // Select all the images inside the cards
                const n = images.length;  // Number of cards

                let value1 = 20;
                if (progress <= 0.5) {
                    value1 = progress * 100;  // Scale from 0 to 50
                } else {
                    value1 = 50;  // Max out at 50 when progress is greater than 0.5
                }

                // Second value increases from 0 to 50 between progress 0.5 to 1
                let value2 = 20;
                if (progress > 0.5) {
                    value2 = (progress - 0.5) * 100;  // Scale from 0 to 50 for progress between 0.5 and 1
                }

                images.forEach((image, index) => {
                    if (index == 0) return

                    image.style.objectPosition = `${index == 1 ? value1 : value2}% center`;
                });
            };

            gsap.to(cards, {
                x: -totalScrollWidth, // scroll to the end of the container
                ease: "none", // no easing for a linear scroll effect
                scrollTrigger: {
                    trigger: cards,
                    start: "top top",
                    end: () => `+=${totalScrollHeight}`, // total vertical scroll distance
                    scrub: true,
                    pin: true,
                    pinSpacing: true,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        updateObjectPosition(progress)
                    }
                },
            });
        } else {
            const totalScrollHeight = window.innerHeight * 3;
            const cards = document.querySelector(".cards");
            const totalScrollWidth = cards.scrollWidth - window.innerWidth;

            const updateObjectPosition = (progress) => {
                const images = cards.querySelectorAll("img");  // Select all the images inside the cards
                const n = images.length;  // Number of cards

                let value1 = 20;
                if (progress <= 0.5) {
                    value1 = progress * 100;  // Scale from 0 to 50
                } else {
                    value1 = 50;  // Max out at 50 when progress is greater than 0.5
                }

                // Second value increases from 0 to 50 between progress 0.5 to 1
                let value2 = 20;
                if (progress > 0.5) {
                    value2 = (progress - 0.5) * 100;  // Scale from 0 to 50 for progress between 0.5 and 1
                }

                images.forEach((image, index) => {
                    if (index == 0) return

                    image.style.objectPosition = `${index == 1 ? value1 : value2}% center`;
                });
            };

            gsap.to(cards, {
                x: -totalScrollWidth, // scroll to the end of the container
                ease: "none", // no easing for a linear scroll effect
                scrollTrigger: {
                    trigger: cards,
                    start: "top top",
                    end: () => `+=${totalScrollHeight}`, // total vertical scroll distance
                    scrub: true,
                    pin: true,
                    pinSpacing: true,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        updateObjectPosition(progress)
                    }
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
        gsap.from(".hero-img", { opacity: 0, duration: 1 })
        gsap.from([".hero-left-column span", ".hero-left-column a"], { opacity: 0, duration: 1, x: -50, stagger: 0.2 })
        gsap.from(".hero-right-column", { opacity: 0, duration: 1, x: 50, stagger: 0.2 })

        // #region Hero Img

        Array.from(document.querySelectorAll('.hero-img')).forEach((e) => {
            const imgs = Array.from(e.querySelectorAll('img'));
            new hoverEffect({
                parent: e,
                intensity: 0.3,
                angle: 90,
                image1: imgs[1].getAttribute('src'),
                image2: imgs[0].getAttribute('src'),
                displacementImage: '../assets/displacement.png'
            });
        })

        // #region reveals

        gsap.from('.left-content .bonus-item', {
            scrollTrigger: {
                trigger: ".left-content",
                start: "top 80%",
                once: true
            },
            x: -100,
            opacity: 0,
            duration: 1.3,
            ease: "power3.out",
            stagger:0.4
        });

        gsap.from('.right-content .bonus-item', {
            scrollTrigger: {
                trigger: ".right-content",
                start: "top 80%",
                once: true
            },
            x: 100,
            opacity: 0,
            duration: 1.3,
            ease: "power3.out",
            stagger: 0.4
        });

        gsap.from('.center-content *', {
            scrollTrigger: {
                trigger: ".center-content",
                start: "top 80%",
                once: true
            },
            y: 100,
            opacity: 0,
            duration: 1.3,
            ease: "power3.out",
            stagger: 0.2
        });

        gsap.from('.contact-form', {
            scrollTrigger: {
                trigger: ".contact-form",
                start: "top 80%",
                once: true
            },
            x: -100,
            opacity: 0,
            duration: 1.3,
            ease: "power3.out",
        });

        // #region testimonials

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
            "../assets/test4.webm",
            "../assets/test1.webm",
            "../assets/test2.webm",
            "../assets/test3.webm",
        ];
        let allTestimonialsName = [
            { name: "Shridatt Zambodkar.", work: "C.E.O of Intuio Software Labs" },
            { name: "Sairaj Ghadge.", work: "Founder of Rhythm and Souls" },
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
                duration: .5,
                clipPath: 'circle(150% at 50% 100%)',
                ease: "expo.out",
                onComplete: () => {
                    window.location.href = 'projects.html';
                    gsap.to(".page-transition", {
                        duration: 1,
                        clipPath: 'circle(0% at 50% 100%)',
                        ease: "none",
                    })
                }
            })
        }

        project_btn.addEventListener("click", pageTransition)
        project_btn_mob.addEventListener("click", pageTransition)

        // #region contact form
        const formspreeURL = "https://formspree.io/f/xzzbwzdo";
        let contactBtn = document.querySelector("#contact-btn");

        contactBtn.addEventListener("click", (e) => {
            e.preventDefault();

            contactBtn.textContent = 'Sent!';

            // Disable the button
            contactBtn.disabled = true;

            // Set a timeout to re-enable the button after 2 seconds
            setTimeout(function () {
                // Change text back to "Send"
                contactBtn.textContent = 'Send';

                // Enable the button
                contactBtn.disabled = false;
            }, 2000);

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
            hamBtn.classList.toggle("is-active")
            if (hamBtn.classList.contains("is-active")) {
                hamContainer.style.backdropFilter = "brightness(0.5)"
            } else {
                hamContainer.style.backdropFilter = "brightness(1)"
            }
        })

        let navLinks = document.querySelectorAll(".mob-nav a");
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                hamContainer.classList.remove("show-menu"); // Ensure the menu closes
                hamBtn.classList.remove("is-active"); // Reset the hamburger icon state
                if (hamBtn.classList.contains("is-active")) {
                    hamContainer.style.backdropFilter = "brightness(0.5)"
                } else {
                    hamContainer.style.backdropFilter = "brightness(1)"
                }
            });
        });

        // #region bonus

        let currentIndex = 0;
        document.querySelector(".slider-left").addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--
                const offset = -currentIndex * 40;
                document.querySelector("#slider").style.transform = `translateX(${offset}%)`;
            }
        })
        document.querySelector(".slider-right").addEventListener("click", () => {
            if (currentIndex < 4) {
                currentIndex++
                const offset = -currentIndex * 40;
                document.querySelector("#slider").style.transform = `translateX(${offset}%)`;
            }
        })

        // #region resume


    } // everthing above this

    // #region process

    const body = document.body;
    const bodyWidth = body.offsetWidth;
    const processBlocks = document.querySelectorAll('.process-block');

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
        processBlocks.forEach(block => {
            const title = block.querySelector('.title').innerText.trim();
            const desc = block.querySelector('.desc');

            if (title === 'Empathize') {
                desc.innerHTML = 'I immerse in users’ world through interviews, surveys, and competitor analysis to uncover needs, building empathy for design.';
            } else if (title === 'Define') {
                desc.innerHTML = 'I synthesize insights into user personas, journey maps, and goals, creating actionable steps to guide the design process.';
            } else if (title === 'Ideate') {
                desc.innerHTML = 'I foster creativity through brainstorming, sketching, and mind mapping to explore diverse design solutions and organize user flows.';
            } else if (title === 'Design') {
                desc.innerHTML = 'I transform ideas into wireframes and prototypes, focusing on typography, color, and visual hierarchy for effective, polished designs.';
            } else if (title === 'Test') {
                desc.innerHTML = 'I refine designs through A/B testing, usability surveys, and user feedback, ensuring the design meets expectations and needs.';
            }
        });
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
        processBlocks.forEach(block => {
            const title = block.querySelector('.title').innerText.trim();
            const desc = block.querySelector('.desc');

            if (title === 'Empathize') {
                desc.innerHTML = 'I immerse myself in the user’s world through interviews, surveys, focus groups, and competitor analysis to understand their needs and pain points, building empathy as the foundation of user-centered design';
            } else if (title === 'Define') {
                desc.innerHTML = 'Using insights from the Empathize phase, I define the problem and project goals, creating user personas, empathy maps, and journey maps to turn data into clear, actionable insights that guide the design process.';
            } else if (title === 'Ideate') {
                desc.innerHTML = 'In the Ideate phase, I foster creativity and collaboration through brainstorming, mind mapping, card sorting, user flows, information architecture, and sketching to explore diverse design possibilities';
            } else if (title === 'Design') {
                desc.innerHTML = 'In the Design phase, I turn selected ideas into paper wireframes and high-fidelity prototypes using tools like Figma. I focus on details like typography, color schemes, and visual hierarchy to create polished, effective designs.';
            } else if (title === 'Test') {
                desc.innerHTML = 'Testing is a continuous part of the design process. I use methods like A/B testing, usability surveys, and eye-tracking to gather user feedback and data, ensuring the design meets user needs and expectations.';
            }
        });
    }




    // Cleanup function to remove ScrollTrigger instances if necessary
    window.addEventListener("beforeunload", () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    });

});