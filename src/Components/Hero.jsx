import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { SETTING_API } from "../utils/constant";

export default function Hero() {
    const [settings, setSettings] = useState({
        websiteName: "Lex Corpus",
        tagline: "Lawyers & Associates",
        heroTitle:
            "Every matter argued on its merits",
        heroSubtitle:
            "A full-service law firm advising individuals, families, and enterprises across seven areas of practice.",
        heroButtonText: "State your matter",
        heroButtonLink: "/contactUs",
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } =
                    await axios.get(SETTING_API);

                if (
                    data?.success &&
                    data?.settings
                ) {
                    setSettings(data.settings);
                }
            } catch (error) {
                console.error(
                    "Hero settings error:",
                    error
                );
            }
        };

        fetchSettings();
    }, []);

    const buttonText =
        settings.heroButtonText ||
        "State your matter";

    const buttonLink =
        settings.heroButtonLink ||
        "/contactUs";

    return (
        <section className="hero">
            <div className="wrap hero-inner">
                <div className="hero-content">
                    <div className="hero-eyebrow eyebrow">
                        {settings.websiteName}
                        <span>—</span>
                        {settings.tagline}
                    </div>

                    <h1 className="hero-title">
                        {settings.heroTitle}
                    </h1>

                    <p className="hero-lede">
                        {settings.heroSubtitle}
                    </p>

                    <div className="hero-actions">
                        <a
                            href="#practice"
                            className="hero-practice-button"
                        >
                            <span>
                                View Practice Areas
                            </span>

                            <span
                                aria-hidden="true"
                                className="hero-button-arrow"
                            >
                                →
                            </span>
                        </a>

                        <Link
                            to={buttonLink}
                            className="hero-contact-button"
                        >
                            {buttonText}
                        </Link>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-visual-frame">
                        <div className="hero-visual-top">
                            <span>
                                LEX CORPUS
                            </span>

                            <span>
                                EST. 2026
                            </span>
                        </div>

                        <div className="hero-visual-seal">
                            LC
                        </div>

                        <div className="hero-visual-line" />

                        <p className="hero-visual-title">
                            Counsel with clarity.
                            <br />
                            Advocacy with purpose.
                        </p>

                        <div className="hero-visual-bottom">
                            <span>
                                LAW • ADVISORY •
                                REPRESENTATION
                            </span>

                            <span>
                                01
                            </span>
                        </div>
                    </div>

                    <div
                        className="hero-visual-orbit"
                        aria-hidden="true"
                    />
                </div>
            </div>

            <div
                className="hero-bottom-bar"
                aria-hidden="true"
            >
                <span>LEX CORPUS</span>

                <span>
                    PROFESSIONAL LEGAL SERVICES
                </span>

                <span>SCROLL TO EXPLORE ↓</span>
            </div>
        </section>
    );
}