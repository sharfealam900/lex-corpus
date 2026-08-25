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

  // =========================
  // FETCH ARTICLES
  // =========================

  const fetchArticles = async () => {
    try {
      const { data } = await axios.get(ARTICLE_API);

      if (data.success) {
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // =========================
  // CATEGORIES
  // =========================

  const tags = useMemo(() => {
    const categories = articles
      .map((article) => article.category)
      .filter(Boolean);

    return ["All", ...new Set(categories)];
  }, [articles]);

  // =========================
  // FILTER ARTICLES
  // =========================

  const filteredArticles = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return articles.filter((article) => {
      const tagMatch =
        activeTag === "All" ||
        article.category === activeTag;

      if (!search) {
        return tagMatch;
      }

      const searchableText = [
        article.title,
        article.excerpt,
        article.content,
        article.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return tagMatch && searchableText.includes(search);
    });
  }, [articles, activeTag, searchTerm]);

  // =========================
  // DATE FORMAT
  // =========================

  const formatDate = (date) => {
    if (!date) return "";

    const formatted = new Date(date);

    if (Number.isNaN(formatted.getTime())) {
      return "";
    }

    return formatted.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =========================
  // RESET FILTER
  // =========================

  const resetFilters = () => {
    setSearchTerm("");
    setActiveTag("All");
  };

  return (
    <>
      <Navbar />

      <main className="blog-page">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="blog-hero">

          <div className="wrap">

            <div className="blog-hero-content">

              <div className="eyebrow">
                Insights
              </div>

              <h1>
                Notes from <em>the practice</em>
              </h1>

              <p>
                Articles from our associates on cases, rulings
                and legal procedures written in simple language
                for everyone.
              </p>

            </div>

            <div className="blog-hero-meta">

              <span>
                {articles.length}{" "}
                {articles.length === 1
                  ? "ARTICLE"
                  : "ARTICLES"}
              </span>

              <span>
                LEX CORPUS
              </span>

            </div>

          </div>

        </section>


        {/* =====================================================
            FILTER / SEARCH
        ====================================================== */}

        <section className="blog-toolbar">

          <div className="wrap">

            <div className="blog-toolbar-inner">

              <div className="filter-tags">

                {tags.map((tag) => (

                  <button
                    key={tag}
                    type="button"
                    className={`filter-tag ${
                      activeTag === tag
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveTag(tag)
                    }
                  >
                    {tag}
                  </button>

                ))}

              </div>


              <div className="blog-search">

                <span className="search-icon">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="search"
                  placeholder="Search articles"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  aria-label="Search articles"
                />

                {searchTerm && (

                  <button
                    type="button"
                    className="clear-search"
                    onClick={() =>
                      setSearchTerm("")
                    }
                    aria-label="Clear search"
                  >
                    <i className="bi bi-x"></i>
                  </button>

                )}

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            ARTICLES
        ====================================================== */}

        <section className="blog-content">

          <div className="wrap">

            {/* LOADING */}

            {loading ? (

              <div className="blog-state">

                <div className="blog-loader"></div>

                <p>
                  Loading insights...
                </p>

              </div>

            ) : filteredArticles.length === 0 ? (

              /* EMPTY */

              <div className="blog-empty">

                <div className="empty-icon">
                  <i className="bi bi-journal-text"></i>
                </div>

                <h2>
                  No articles found
                </h2>

                <p>
                  Try another search term or select
                  a different practice area.
                </p>

                {(searchTerm ||
                  activeTag !== "All") && (

                  <button
                    type="button"
                    onClick={resetFilters}
                  >
                    View all articles
                  </button>

                )}

              </div>

            ) : (

              <>

                {/* RESULT COUNT */}

                <div className="blog-result-info">

                  <span>
                    {filteredArticles.length}{" "}
                    {filteredArticles.length === 1
                      ? "RESULT"
                      : "RESULTS"}
                  </span>

                  {activeTag !== "All" && (

                    <span>
                      {activeTag}
                    </span>

                  )}

                </div>


                {/* ARTICLE GRID */}

                <div className="blog-grid-list">

                  {filteredArticles.map(
                    (article) => (

                      <Link
                        key={article._id}
                        to={`/article/${article._id}`}
                        className="blog-card-link"
                      >

                        <article className="blog-card">

                          {/* TOP */}

                          <div className="blog-card-top">

                            <span className="blog-card-category">

                              {article.category ||
                                "Legal Insight"}

                            </span>

                          </div>


                          {/* BODY */}

                          <div className="blog-card-body">

                            <div className="blog-card-date">

                              {formatDate(
                                article.createdAt
                              )}

                            </div>


                            <h2>
                              {article.title}
                            </h2>


                            <p>
                              {article.excerpt ||
                                "Read this legal insight from Lex Corpus."}
                            </p>


                            {/* BOTTOM */}

                            <div className="blog-card-bottom">

                              <span className="blog-read-time">

                                {article.readTime ||
                                  "5 min read"}

                              </span>


                              <span className="blog-read-more">

                                Read article

                                <span className="read-arrow">
                                  ↗
                                </span>

                              </span>

                            </div>

                          </div>

                        </article>

                      </Link>

                    )
                  )}

                </div>

              </>

            )}

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}