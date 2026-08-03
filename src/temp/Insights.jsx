import React, { useEffect, useState } from "react";
import axios from "axios";
import { ARTICLE_API } from "../utils/constant";
import { Link } from "react-router-dom";

export default function Insights() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRandomArticles = async () => {
        try {
            const { data } = await axios.get(`${ARTICLE_API}/random`);

            if (data.success) {
                setArticles(data.articles);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomArticles();
    }, []);

    return (
        <section className="insights" id="insights">
            <div className="wrap">
                <div className="section-head">
                    <div className="eyebrow">Insights</div>

                    <h2>Notes from the practice</h2>

                    <p>
                        Short reads from our associates on cases, rulings, and procedure
                        worth knowing about — written for clients, not just for counsel.
                        <a
                            href="/blog"
                            style={{
                                color: "var(--seal)",
                                borderBottom: "1px solid var(--seal-dim)",
                                marginLeft: "5px",
                            }}
                        >
                            Read the full blog →
                        </a>
                    </p>
                </div>

                {loading ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "50px",
                        }}
                    >
                        <h4>Loading Articles...</h4>
                    </div>
                ) : articles.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "50px",
                        }}
                    >
                        <h4>No Articles Available</h4>
                    </div>
                ) : (
                    <div className="insight-grid">
                        {articles.map((article) => (
                            <Link
                                key={article._id}
                                to={`/article/${article._id}`}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    display: "block",
                                }}
                            >
                                <article className="insight-card">
                                    <span className="insight-tag  ">
                                        {article.category}
                                    </span>

                                    <h3>{article.title}</h3>

                                    <p>{article.excerpt}</p>

                                    <div className="insight-meta">
                                        <span>{article.author}</span>
                                        <span>{article.readTime}</span>
                                    </div>

                                    <span
                                        style={{
                                            marginTop: "18px",
                                            display: "inline-block",
                                            color: "#b68d40",
                                            fontWeight: "600",
                                        }}
                                    >
                                        Read More →
                                    </span>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}