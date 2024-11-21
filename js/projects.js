document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;

    // Get the width and height of the body in pixels
    const bodyWidth = body.offsetWidth;
    const bodyHeight = body.offsetHeight;

    document.getElementById("pointer-ring").style.opacity = 1
    gsap.registerPlugin(ScrollTrigger);

    // #region Smooth scroll
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // #region page transition
    gsap.to(".page-transition", {
        duration: 2,
        clipPath: 'circle(0% at 50% 0%)',
        ease: "expo.in",
    })

    // #region redirect to home
    document.querySelector(".home-nav").addEventListener("click", () => {
        window.location.href = 'index.html';
    })

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

})