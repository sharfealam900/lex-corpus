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

    useEffect(() => {
        if (!location.state?.scrollTo) {
            return;
        }

        const id = location.state.scrollTo;

        const scrollToSection = () => {
            const element = document.getElementById(id);

            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        };

        const timer = setTimeout(scrollToSection, 100);

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

        return () => clearTimeout(timer);
    }, [location]);

    useEffect(() => {
        const sections = [
            "hero",
            "practice",
            "about",
            "insights",
            "contactUs",
        ];

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            b.intersectionRatio -
                            a.intersectionRatio
                    );

                const visibleSection =
                    visibleEntries[0];

                if (!visibleSection) {
                    return;
                }

                const sectionMap = {
                    hero: "home",
                    practice: "practice",
                    about: "about",
                    insights: "insights",
                    contactUs: "contactUs",
                };

                setActiveSection(
                    sectionMap[
                        visibleSection.target.id
                    ] || "home"
                );
            },
            {
                root: null,
                rootMargin: "-20% 0px -55% 0px",
                threshold: [0.1, 0.25, 0.5],
            }
        );

        sections.forEach((id) => {
            const element =
                document.getElementById(id);

            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Navbar activeSection={activeSection} />

            <main className="home-page">
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

                <div id="contactUs">
                    <ContactUs />
                </div>
            </main>

            <Footer />
        </>
    );
}