document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;

    // Get the width and height of the body in pixels
    const bodyWidth = body.offsetWidth;
    const bodyHeight = body.offsetHeight;

    document.getElementById("pointer-ring").style.opacity = 1
    gsap.registerPlugin(ScrollTrigger);

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

    // #region page transition
    gsap.to(".page-transition", {
        duration: 1,
        clipPath: 'circle(0% at 50% 0%)',
        ease: "expo.in",
    })

    // #region redirect to home
    // document.querySelector(".home-nav").addEventListener("click", () => {
    //     window.location.href = 'index.html';
    // })

    // #region line animation
    let svg = document.querySelector(".line")
    let path = svg.querySelector("path")

    const pathLength = path.getTotalLength()

    gsap.set(path, {
        strokeDasharray: pathLength,
    })
    gsap.fromTo(path, {
        strokeDashoffset: pathLength,
    }, {
        strokeDashoffset: 0,
        duration: 10,
        ease: "none",
        scrollTrigger: {
            trigger: ".line",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    })

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

    let projects = document.querySelectorAll(".box")
    if (bodyWidth <= 800) {
        projects.forEach((ele, ind) => {
            gsap.from(ele, {
                x: ind % 2 == 0 ? 100 : -100,
                opacity: 0,
                ease: "power1.out",
                duration: 1,
                scrollTrigger: {
                    trigger: ele,
                    start: "start 80%",
                    once: true
                },
            })
        })
    }

})