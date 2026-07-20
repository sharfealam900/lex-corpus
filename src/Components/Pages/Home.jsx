import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../Navbar";
import Hero from "../Hero";
import Practice from "../Practice";
import About from "../About";
import Insights from "../Insights";
import ContactUs from "../ContactUs";
import Footer from "../Footer";

export default function Home() {
    const location = useLocation();

    const [activeSection, setActiveSection] = useState("home");

    // Scroll to section when coming from another page
    useEffect(() => {
        if (location.state?.scrollTo) {
            const id = location.state.scrollTo;

            setTimeout(() => {
                const element = document.getElementById(id);

                if (element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }

                window.history.replaceState({}, document.title);
            }, 100);
        }
    }, [location]);

    // Scroll Spy
    useEffect(() => {
        const sections = [
            "hero",
            "practice",
            "about",
            "insights",
        ];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    switch (entry.target.id) {
                        case "hero":
                            setActiveSection("home");
                            break;

                        case "practice":
                            setActiveSection("practice");
                            break;

                        case "about":
                            setActiveSection("about");
                            break;

                        case "insights":
                            setActiveSection("insights");
                            break;

                        default:
                            break;
                    }
                });
            },
            {
                threshold: 0.45,
            }
        );

        sections.forEach((id) => {
            const section = document.getElementById(id);

            if (section) {
                observer.observe(section);
            }
        });

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Navbar activeSection={activeSection} />

            <div id="hero">
                <Hero />
            </div>

            <div id="practice">
                <Practice />
            </div>

            <div id="about">
                <About />
            </div>

            <div id="insights">
                <Insights />
            </div>

            <ContactUs />

            <Footer />
        </>
    );
}