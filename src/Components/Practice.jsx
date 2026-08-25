import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PRACTICE_API_END_POINT } from "../utils/constant";


export default function Practice() {
    const [practices, setPractices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPractices = async () => {
            try {
                const { data } = await axios.get(PRACTICE_API_END_POINT);

                if (data?.success) {
                    setPractices(
                        data.practices ||
                        data.practiceAreas ||
                        []
                    );
                }
            } catch (error) {
                console.error("Practice areas error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPractices();
    }, []);

    return (
        <section className="practice-section" id="practice">
            <div className="practice-wrap">

                <div className="practice-heading-row">
                    <div className="practice-heading-left">
                        <div className="practice-label">
                            <span>02</span>
                            <i></i>
                            <span>PRACTICE AREAS</span>
                        </div>

                        <h2>
                            Legal experience.
                            <br />
                            <span>Practical results.</span>
                        </h2>
                    </div>

                    <div className="practice-heading-right">
                        <p>
                            Thoughtful legal counsel for individuals,
                            families and businesses. We focus on
                            understanding the matter first, then
                            building a clear strategy around it.
                        </p>

                        <Link to="/contactUs">
                            Discuss your matter
                            <ArrowUpRight size={15} />
                        </Link>
                    </div>
                </div>

                <div className="practice-rule"></div>

                {loading ? (
                    <div className="practice-loading">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                ) : practices.length > 0 ? (
                    <div className="practice-list">
                        {practices.map((practice, index) => {
                            const id =
                                practice._id ||
                                practice.id ||
                                index;

                            const title =
                                practice.name ||
                                practice.title ||
                                "Legal Practice";

                            const description =
                                practice.description ||
                                practice.details ||
                                "";

                            return (
                                <article
                                    className="practice-item"
                                    key={id}
                                >
                                    <div className="practice-item-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>

                                    <div className="practice-item-main">
                                        <h3>{title}</h3>

                                        {description && (
                                            <p>{description}</p>
                                        )}
                                    </div>

                                    <div className="practice-item-action">
                                        {practice._id || practice.id ? (
                                            <Link
                                                to={`/practice/${practice._id || practice.id}`}
                                                aria-label={`Explore ${title}`}
                                            >
                                                <span>Explore</span>
                                                <ArrowUpRight size={17} />
                                            </Link>
                                        ) : (
                                            <span>
                                                <ArrowUpRight size={17} />
                                            </span>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="practice-empty">
                        <span>01</span>
                        <h3>Legal guidance built around your matter.</h3>
                    </div>
                )}

                <div className="practice-bottom">
                    <span>LEX CORPUS</span>

                    <span>
                        PROFESSIONAL LEGAL SERVICES
                    </span>

                    <span>INDIA</span>
                </div>
            </div>
        </section>
    );
}