import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
    return (
        <section className="about-section" id="about">
            <div className="about-wrap">

                <div className="about-top">
                    <div className="about-label">
                        <span>03</span>
                        <i></i>
                        <span>ABOUT LEX CORPUS</span>
                    </div>

                    <div className="about-location">
                        <span>LEX CORPUS</span>
                        <span>LEGAL COUNSEL · INDIA</span>
                    </div>
                </div>

                <div className="about-main">
                    <div className="about-title-area">
                        <h2>
                            Law with
                            <br />
                            <em>clarity.</em>
                        </h2>

                        <div className="about-mark">
                            LC
                        </div>
                    </div>

                    <div className="about-content">
                        <p className="about-lead">
                            Legal problems can be complex.
                            Your understanding of them
                            shouldn't be.
                        </p>

                        <p>
                            Lex Corpus is built around a
                            straightforward principle:
                            understand the matter carefully,
                            explain the position clearly,
                            and pursue the right legal
                            strategy with discipline.
                        </p>

                        <p>
                            We combine legal knowledge with
                            practical thinking to help clients
                            make informed decisions when the
                            stakes matter.
                        </p>

                        <Link
                            to="/contactUs"
                            className="about-button"
                        >
                            Speak with us
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>

                <div className="about-values">

                    <div className="about-value">
                        <span className="about-value-number">
                            01
                        </span>

                        <div>
                            <h3>Clarity</h3>
                            <p>
                                Complex legal issues are
                                explained in a direct,
                                understandable way.
                            </p>
                        </div>
                    </div>

                    <div className="about-value">
                        <span className="about-value-number">
                            02
                        </span>

                        <div>
                            <h3>Strategy</h3>
                            <p>
                                Every matter begins with
                                understanding the facts and
                                identifying the right approach.
                            </p>
                        </div>
                    </div>

                    <div className="about-value">
                        <span className="about-value-number">
                            03
                        </span>

                        <div>
                            <h3>Commitment</h3>
                            <p>
                                We remain focused on the
                                interests and objectives of
                                every client.
                            </p>
                        </div>
                    </div>

                </div>

                <div className="about-bottom">
                    <span>EST. LEX CORPUS</span>

                    <span>
                        TRUST · STRATEGY · REPRESENTATION
                    </span>

                    <span>03 / 06</span>
                </div>
            </div>
        </section>
    );
}