import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import DOMPurify from "dompurify";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { ARTICLE_API } from "../../utils/constant";

export default function ArticleDetails() {
    const { id } = useParams();

    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });

        fetchArticle();
    }, [id]);

    useEffect(() => {
        if (article?._id) {
            fetchRelatedArticles();
        }
    }, [article?._id]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            setError("");
            setArticle(null);
            setRelatedArticles([]);
            setImageError(false);

            const { data } = await axios.get(
                `${ARTICLE_API}/${id}`
            );

            if (!data?.success || !data?.article) {
                throw new Error(
                    "Article not found."
                );
            }

            setArticle(data.article);
        } catch (err) {
            console.error(
                "Article fetch error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to load this article."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedArticles = async () => {
        try {
            const { data } = await axios.get(
                `${ARTICLE_API}/random`
            );

            if (!data?.success || !Array.isArray(data.articles)) {
                setRelatedArticles([]);
                return;
            }

            const sameCategory = data.articles
                .filter(
                    (item) =>
                        item._id !== article?._id &&
                        item.category === article?.category
                )
                .slice(0, 3);

            if (sameCategory.length > 0) {
                setRelatedArticles(sameCategory);
                return;
            }

            const fallbackArticles = data.articles
                .filter(
                    (item) =>
                        item._id !== article?._id
                )
                .slice(0, 3);

            setRelatedArticles(
                fallbackArticles
            );
        } catch (err) {
            console.error(
                "Related articles fetch error:",
                err
            );

            setRelatedArticles([]);
        }
    };

    const getImageUrl = (image) => {
        if (!image) {
            return "";
        }

        if (typeof image === "string") {
            return image;
        }

        if (
            typeof image === "object" &&
            typeof image.url === "string"
        ) {
            return image.url;
        }

        return "";
    };

    const articleImage = getImageUrl(
        article?.image
    );

    const safeContent = DOMPurify.sanitize(
        article?.content || "",
        {
            USE_PROFILES: {
                html: true,
            },
        }
    );

    const formattedDate = article?.createdAt
        ? new Date(
              article.createdAt
          ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "";

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="article-page">
                    <div className="article-container article-loading">
                        <div className="article-skeleton article-skeleton-back" />

                        <div className="article-skeleton article-skeleton-tag" />

                        <div className="article-skeleton article-skeleton-title" />

                        <div className="article-skeleton article-skeleton-meta" />

                        <div className="article-skeleton article-skeleton-image" />

                        <div className="article-skeleton article-skeleton-text" />

                        <div className="article-skeleton article-skeleton-text short" />

                        <div className="article-skeleton article-skeleton-text" />

                        <div className="article-skeleton article-skeleton-text medium" />
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    if (error || !article) {
        return (
            <>
                <Navbar />

                <main className="article-page">
                    <div className="article-container article-error">
                        <div className="article-error-icon">
                            !
                        </div>

                        <span className="article-error-label">
                            Article unavailable
                        </span>

                        <h1>
                            Article Not Found
                        </h1>

                        <p>
                            {error ||
                                "The article you're looking for is unavailable or may have been removed."}
                        </p>

                        <Link
                            to="/blog"
                            className="article-back-button"
                        >
                            <span>←</span>
                            Back to Articles
                        </Link>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="article-page">
                <header className="article-header">
                    <div className="article-container">
                        <Link
                            to="/blog"
                            className="article-back-link"
                            aria-label="Back to all articles"
                        >
                            <span aria-hidden="true">
                                ←
                            </span>

                            <span>
                                Back to all articles
                            </span>
                        </Link>

                        <div className="article-category">
                            {article.category}
                        </div>

                        <h1 className="article-title">
                            {article.title}
                        </h1>

                        <div className="article-meta">
                            {formattedDate && (
                                <span>
                                    {formattedDate}
                                </span>
                            )}

                            {article.readTime && (
                                <>
                                    <span
                                        className="article-meta-dot"
                                        aria-hidden="true"
                                    >
                                        •
                                    </span>

                                    <span>
                                        {article.readTime}
                                    </span>
                                </>
                            )}

                            {article.author && (
                                <>
                                    <span
                                        className="article-meta-dot"
                                        aria-hidden="true"
                                    >
                                        •
                                    </span>

                                    <span>
                                        By{" "}
                                        {
                                            article.author
                                        }
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <article className="article-main">
                    <div className="article-container">
                        {articleImage &&
                            !imageError && (
                                <div className="article-image-wrapper">
                                    <img
                                        src={
                                            articleImage
                                        }
                                        alt={
                                            article.title
                                        }
                                        className="article-image"
                                        loading="eager"
                                        decoding="async"
                                        onError={() =>
                                            setImageError(
                                                true
                                            )
                                        }
                                    />
                                </div>
                            )}

                        <div className="article-content-wrapper">
                            {article.excerpt && (
                                <p className="article-excerpt">
                                    {
                                        article.excerpt
                                    }
                                </p>
                            )}

                            <div
                                className="article-content"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        safeContent,
                                }}
                            />
                        </div>
                    </div>
                </article>

                {relatedArticles.length > 0 && (
                    <section className="related-section">
                        <div className="article-container">
                            <div className="related-heading">
                                <div>
                                    <span className="related-eyebrow">
                                        Continue Reading
                                    </span>

                                    <h2>
                                        Related Articles
                                    </h2>
                                </div>

                                <Link
                                    to="/blog"
                                    className="related-view-all"
                                >
                                    <span>
                                        View all
                                    </span>

                                    <span aria-hidden="true">
                                        →
                                    </span>
                                </Link>
                            </div>

                            <div className="related-grid">
                                {relatedArticles.map(
                                    (item) => {
                                        const image =
                                            getImageUrl(
                                                item.image
                                            );

                                        return (
                                            <Link
                                                key={
                                                    item._id
                                                }
                                                to={`/article/${item._id}`}
                                                className="related-card"
                                            >
                                                {image && (
                                                    <div className="related-card-image-wrapper">
                                                        <img
                                                            src={
                                                                image
                                                            }
                                                            alt={
                                                                item.title
                                                            }
                                                            className="related-card-image"
                                                            loading="lazy"
                                                            decoding="async"
                                                        />
                                                    </div>
                                                )}

                                                <div className="related-card-body">
                                                    <span className="related-card-category">
                                                        {
                                                            item.category
                                                        }
                                                    </span>

                                                    <h3>
                                                        {
                                                            item.title
                                                        }
                                                    </h3>

                                                    {item.excerpt && (
                                                        <p>
                                                            {
                                                                item.excerpt
                                                            }
                                                        </p>
                                                    )}

                                                    <span className="related-card-link">
                                                        <span>
                                                            Read
                                                            Article
                                                        </span>

                                                        <span aria-hidden="true">
                                                            →
                                                        </span>
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </>
    );
}