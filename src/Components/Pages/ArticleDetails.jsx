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

  // --------------------------------
  // FETCH ARTICLE
  // --------------------------------

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError("");
      setArticle(null);
      setRelatedArticles([]);

      const { data } = await axios.get(
        `${ARTICLE_API}/${id}`
      );

      if (!data?.success || !data?.article) {
        throw new Error("Article not found.");
      }

      setArticle(data.article);
    } catch (err) {
      console.error("Article fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load this article."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // FETCH RELATED ARTICLES
  // --------------------------------

  const fetchRelatedArticles = async () => {
    try {
      const { data } = await axios.get(
        `${ARTICLE_API}/random`
      );

      if (
        !data?.success ||
        !Array.isArray(data.articles)
      ) {
        setRelatedArticles([]);
        return;
      }

      // First try same category
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

      // Otherwise fallback to any articles
      const fallbackArticles = data.articles
        .filter(
          (item) =>
            item._id !== article?._id
        )
        .slice(0, 3);

      setRelatedArticles(fallbackArticles);
    } catch (err) {
      console.error(
        "Related articles fetch error:",
        err
      );

      setRelatedArticles([]);
    }
  };

  // --------------------------------
  // SAFE CONTENT
  // --------------------------------

  const safeContent = DOMPurify.sanitize(
    article?.content || "",
    {
      USE_PROFILES: {
        html: true,
      },
    }
  );

  // --------------------------------
  // DATE
  // --------------------------------

  const formattedDate = article?.createdAt
    ? new Date(
        article.createdAt
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="article-page">

          <section className="article-loading">
            <div className="article-loading-inner">

              <div className="loading-line small"></div>

              <div className="loading-line category"></div>

              <div className="loading-line title"></div>

              <div className="loading-line title short"></div>

              <div className="loading-line meta"></div>

              <div className="loading-content">
                <div></div>
                <div></div>
                <div></div>
                <div className="short"></div>
              </div>

            </div>
          </section>

        </main>

        <Footer />
      </>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------

  if (error || !article) {
    return (
      <>
        <Navbar />

        <main className="article-page">

          <section className="article-error">
            <div className="article-error-inner">

              <div className="article-error-number">
                404
              </div>

              <span className="article-eyebrow">
                Article unavailable
              </span>

              <h1>
                Article not found
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
          </section>

        </main>

        <Footer />
      </>
    );
  }

  // --------------------------------
  // MAIN PAGE
  // --------------------------------

  return (
    <>
      <Navbar />

      <main className="article-page">

        {/* =========================
            ARTICLE HEADER
        ========================= */}

        <header className="article-header">

          <div className="article-header-inner">

            <Link
              to="/blog"
              className="article-back-link"
            >
              <span className="back-arrow">
                ←
              </span>

              <span>
                Back to all articles
              </span>
            </Link>

            <div className="article-header-content">

              <div className="article-category-row">

                <span className="article-category">
                  {article.category ||
                    "Legal Insight"}
                </span>

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
                    <span className="meta-dot">
                      •
                    </span>

                    <span>
                      {article.readTime}
                    </span>
                  </>
                )}

                <span className="meta-dot">
                  •
                </span>

                <span>
                  By{" "}
                  {article.author ||
                    "Lex Corpus"}
                </span>

              </div>

            </div>

          </div>

        </header>

        {/* =========================
            ARTICLE BODY
        ========================= */}

        <article className="article-main">

          <div className="article-reading-column">

            {article.excerpt && (
              <div className="article-introduction">

                <span className="intro-label">
                  Overview
                </span>

                <p>
                  {article.excerpt}
                </p>

              </div>
            )}

            <div
              className="article-content"
              dangerouslySetInnerHTML={{
                __html: safeContent,
              }}
            />

            {/* Article ending */}

            <div className="article-ending">

              <div className="ending-line"></div>

              <div className="ending-content">

                <span>
                  Lex Corpus
                </span>

                <p>
                  Legal insights written in
                  clear and practical language.
                </p>

              </div>

            </div>

          </div>

        </article>

        {/* =========================
            RELATED ARTICLES
        ========================= */}

        {relatedArticles.length > 0 && (
          <section className="related-section">

            <div className="related-inner">

              <div className="related-header">

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
                  View all
                  <span>→</span>
                </Link>

              </div>

              <div className="related-grid">

                {relatedArticles.map(
                  (item, index) => (
                    <Link
                      key={item._id}
                      to={`/article/${item._id}`}
                      className="related-card"
                    >

                      <div className="related-card-top">

                        <span className="related-number">
                          0{index + 1}
                        </span>

                        <span className="related-category">
                          {item.category ||
                            "Legal Insight"}
                        </span>

                      </div>

                      <div className="related-card-content">

                        <h3>
                          {item.title}
                        </h3>

                        {item.excerpt && (
                          <p>
                            {item.excerpt}
                          </p>
                        )}

                      </div>

                      <div className="related-card-footer">

                        <span>
                          {item.readTime ||
                            "5 min read"}
                        </span>

                        <span className="related-read">
                          Read article
                          <span>↗</span>
                        </span>

                      </div>

                    </Link>
                  )
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