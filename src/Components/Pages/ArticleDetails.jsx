import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import Navbar from "../Navbar";
import Footer from "../Footer";
import { ARTICLE_API } from "../../utils/constant";

export default function ArticleDetails() {
    const { id } = useParams();

    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchArticle();
        fetchRelatedArticles();
    }, [id]);

    const fetchArticle = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(`${ARTICLE_API}/${id}`);

            if (data.success) {
                setArticle(data.article);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedArticles = async () => {
        try {
            const { data } = await axios.get(`${ARTICLE_API}/random`);

            if (data.success) {
                setRelatedArticles(data.articles);
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <div
                    style={{
                        minHeight: "70vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <h2>Loading Article...</h2>
                </div>

                <Footer />
            </>
        );
    }

    if (!article) {
        return (
            <>
                <Navbar />

                <div
                    style={{
                        minHeight: "70vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <h2>Article Not Found</h2>

                    <Link
                        to="/blog"
                        className="back-link"
                        style={{ marginTop: 20 }}
                    >
                        ← Back to Blog
                    </Link>
                </div>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="detail-header">
                <div className="wrap">
                    <Link to="/blog" className="back-link">
                        ← Back to all articles
                    </Link>
                </div>
            </div>

            <section className="detail-body">
                <div className="">

                    <div className="detail-tag ">
                        <span className="insight-tag ">
                            {article.category}
                        </span>
                    </div>

                    <h1>{article.title}</h1>

                    <div className="detail-meta">
                        <span>
                            {new Date(article.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>

                        <span>{article.readTime}</span>

                        {article.author && (
                            <span>{article.author}</span>
                        )}
                    </div>

                    {article.image && (
                        <img
                            src={article.image}
                            alt={article.title}
                            className="detail-image"
                        />
                    )}

                    {article.excerpt && (
                        <p className="detail-excerpt">
                            {article.excerpt}
                        </p>
                    )}

                    <div
                        className="article-content"
                        dangerouslySetInnerHTML={{
                            __html: article.content || "",
                        }}
                    />
                </div>
            </section>

            <section className="related-section">
                <div className="wrap">

                    <h2 className="related-title">
                        Related Articles
                    </h2>

                    <div className="insight-grid">
                        {relatedArticles
                            .filter((item) => item._id !== article._id)
                            .slice(0, 3)
                            .map((item) => (
                                <article
                                    key={item._id}
                                    className="insight-card"
                                >
                                    <span className="insight-tag">
                                        {item.category}
                                    </span>

                                    <h3>{item.title}</h3>

                                    <p>{item.excerpt}</p>

                                    <Link
                                        to={`/article/${item._id}`}
                                        className="read-more"
                                    >
                                        Read Article →
                                    </Link>
                                </article>
                            ))}
                    </div>

                </div>
            </section>

            <div className="blog-footer">
                <Footer />
            </div>
        </>
    );
}