import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { ARTICLE_API } from "../utils/constant";

export default function Blog() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [activeTag, setActiveTag] = useState("All");

    const fetchArticles = async () => {
        try {
            const { data } = await axios.get(ARTICLE_API);

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
        fetchArticles();
    }, []);

    const tags = useMemo(() => {
        return [
            "All",
            ...new Set(
                articles.map((article) => article.category)
            ),
        ];
    }, [articles]);

    const filteredArticles = useMemo(() => {
        return articles.filter((article) => {
            const tagMatch =
                activeTag === "All" ||
                article.category === activeTag;

            const searchMatch = (
                article.title +
                article.excerpt +
                article.content +
                article.category
            )
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            return tagMatch && searchMatch;
        });
    }, [articles, activeTag, searchTerm]);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    return (
        <>
            <Navbar />

            <section className="page-head">
                <div className="wrap">
                    <div className="eyebrow">Insights</div>

                    <h1>
                        Notes from <em>the practice</em>
                    </h1>

                    <p>
                        Articles from our associates on cases,
                        rulings and legal procedures written in
                        simple language for everyone.
                    </p>
                </div>
            </section>

            <section className="toolbar">
                <div className="wrap">
                    <div className="toolbar-row">
                        <div className="filter-tags">
                            {tags.map((tag) => (
                                <button
                                    key={tag}
                                    className={`filter-tag ${activeTag === tag ? "active" : ""
                                        }`}
                                    onClick={() => setActiveTag(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        <label
                            className="search-box"
                            htmlFor="search"
                        >
                            <input
                                id="search"
                                type="text"
                                placeholder="Search Articles..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                            />
                        </label>
                    </div>
                </div>
            </section>

            <section className="blog-grid">
                <div className="wrap">

                    {loading ? (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "80px 0",
                            }}
                        >
                            <h2>Loading Articles...</h2>
                        </div>
                    ) : filteredArticles.length === 0 ? (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "80px 0",
                            }}
                        >
                            <h2>No Articles Found</h2>
                        </div>
                    ) : (
                        <div className="grid">
                            {filteredArticles.map((article) => (
                                <Link
                                    key={article._id}
                                    to={`/article/${article._id}`}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                        display: "block",
                                    }}
                                >
                                    <article className="card">
                                        <div className="card-top">
                                            <span className="insight-tag">
                                                {article.category}
                                            </span>
                                        </div>

                                        {article.image && (
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                style={{
                                                    width: "100%",
                                                    height: "220px",
                                                    objectFit: "cover",
                                                    borderRadius: "12px",
                                                    marginBottom: "20px",
                                                }}
                                            />
                                        )}

                                        <h3>{article.title}</h3>

                                        <p>{article.excerpt}</p>

                                        <div className="card-meta">
                                            <span>{formatDate(article.createdAt)}</span>
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

            <div className="blog-footer">
                <Footer />
            </div>
        </>
    );
}