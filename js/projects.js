// #region all projects data
const dataSrc = [
    {
        "imgSrc": "../assets/projects/pet-product-store.png",
        "imgSrcMob": "../assets/projects/pet-mob.png",
        "title": "Pentalooza – Pet Shopping Platform",
        "desc": "A POC e-commerce website for pet owners to buy food, clothing, and pharmacy items conveniently.",
        "prob": "Pet owners often face challenges finding all their pet-related products on a single platform. Pentalooza eliminated this problem by centralizing diverse product categories, streamlining the shopping process, and creating a user-friendly interface that saves time and effort."
    },
    {
        "imgSrc": "../assets/projects/grocery-store.png",
        "imgSrcMob": "../assets/projects/grocery-mob.png",
        "title": "Superstore – Online Grocery Shopping App",
        "desc": "An app designed for shopping fresh and organic groceries with doorstep delivery.",
        "prob": "Traditional grocery shopping is time-consuming and often lacks customization options. The app resolved these issues by:<br/><ul><li>Allowing users to customize quantities and preferences for their orders.</li><li>Simplifying order tracking to reduce uncertainty in deliveries.</li></ul>"
    },
    {
        "imgSrc": "../assets/projects/grocery-store.png",
        "imgSrcMob": "../assets/projects/grocery-mob.png",
        "title": "Quotation Management App",
        "desc": "An app enabling automobile dealerships to generate, manage, and share quotations efficiently.",
        "prob": "Manual quotation processes are prone to errors, delays, and inefficiency. This app:<br/><ul><li>Replaced error-prone manual workflows with automated features for generating and sharing quotations.</li><li>Solved the issue of inconsistent branding by allowing document customization (signatures, company profiles).</li><li>Simplified product search and storage for quicker access during high-demand periods.</li></ul>"
    },
    {
        "imgSrc": "../assets/projects/microwave.png",
        "imgSrcMob": "../assets/projects/microwave-mob.png",
        "title": "Smart Microwave Interface Design",
        "desc": "A smart microwave interface enabling personalized cooking experiences with smart device integration.",
        "prob": "<ul><li>Simplified cooking by introducing personalized recipe suggestions and multi-profile support for families.</li><li>Eliminated the guesswork of cooking times through video guides and smart recommendations.</li><li>Enhanced connectivity with Alexa and Wi-Fi, making smart home integration seamless.</li></ul>"
    },
    {
        "imgSrc": "../assets/projects/microwave.png",
        "imgSrcMob": "../assets/projects/microwave-mob.png",
        "title": "Coaching App",
        "desc": "A platform for small-time coaches to manage communication, resources, and payments efficiently.",
        "prob": "Coaches struggled with disorganized tools like WhatsApp and Excel, leading to communication and payment tracking inefficiencies. The app:<ul><li>Replaced scattered tools with a single platform for real-time messaging and resource sharing.</li><li>Solved late payment issues through automated reminders and tracking systems.</li><li>Organized training content in a centralized library, reducing time spent searching for materials.</li></ul>"
    },
    {
        "imgSrc": "../assets/projects/Relay-app.png",
        "imgSrcMob": "../assets/projects/relay-mob.png",
        "title": "Relay App",
        "desc": "A mobile app connecting relay race participants with compatible teammates.",
        "prob": "Finding teammates with matching goals and performance metrics for relay races was a tedious, manual process. The app:<ul><li>Automated teammate searches by matching participants based on shared goals, pace, and stamina.</li><li>Solved compatibility issues through performance tracking and clear profile management.</li><li>Streamlined the team formation process, allowing participants to focus on training and coordination.</li></ul>"
    },
    {
        "imgSrc": "../assets/projects/lead-CRM.png",
        "imgSrcMob": "../assets/projects/leadcrm.png",
        "title": "Lead CRM",
        "desc": "A CRM platform that simplifies lead management with tools for campaign creation, buyer-supplier communication, and a feature-rich marketplace.",
        "prob": "Designed a seamless signup and setup process with industry vertical and lead type selection, reducing setup time and improving user onboarding.<br/>Enabled users to create, edit, and track campaigns effortlessly, solving the problem of disorganized campaign data.<br/>Added a built-in DocuSign feature, resolving the hassle of managing contracts and agreements externally."
    }
]

let lastWidthState = document.body.clientWidth < 800 ? 'small' : 'large';

function checkWidthAndReload() {
    const currentWidthState = document.body.clientWidth < 800 ? 'small' : 'large';
    if (currentWidthState !== lastWidthState) {
        location.reload();
        lastWidthState = currentWidthState;
    }
}

window.addEventListener('resize', checkWidthAndReload);

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
        duration: .5,
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

    // #region projects
    document.querySelector(".project-count").innerHTML = dataSrc.length
    const container = document.querySelector('.container');

    // Loop through the array and create elements dynamically
    dataSrc.forEach(item => {
        const box = document.createElement('div');
        box.classList.add('box');

        const imgBx = document.createElement('div');
        imgBx.classList.add('imgBx');
        const img = document.createElement('img');
        img.src = bodyWidth <= 800 ? item.imgSrcMob : item.imgSrc;
        img.alt = item.title;
        imgBx.appendChild(img);

        const contentBx = document.createElement('div');
        contentBx.classList.add('contentBx');

        const titleDiv = document.createElement('div');
        titleDiv.innerHTML = `<h2>${item.title}</h2>`;

        const descDiv = document.createElement('div');
        descDiv.innerHTML = `<h2>Description</h2><p>${item.desc}</p>`;

        const probDiv = document.createElement('div');
        probDiv.innerHTML = `<h2>Problem Solved</h2><p>${item.prob}</p>`;

        contentBx.appendChild(titleDiv);
        contentBx.appendChild(descDiv);
        contentBx.appendChild(probDiv);

        box.appendChild(imgBx);
        box.appendChild(contentBx);

        container.appendChild(box);
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