import React, { useEffect, useMemo, useState } from "react";

export default function Blog() {
    const seedArticles = [
        {
            id: "seed-1",
            tag: "Criminal",
            title: "Anticipatory bail: what actually changed in procedure",
            excerpt:
                "A plain-language walkthrough of how courts are applying the revised criminal procedure code to bail applications.",
            readTime: 6,
            date: "2023-11-02",
            content: `Anticipatory bail exists so a person who reasonably fears arrest doesn't have to surrender first and argue later.

The recent procedural changes don't alter that principle, but they do change how quickly a court expects an application to move.

The first shift is documentation. Courts are now more willing to reject applications that don't clearly state why arrest is apprehended.

The second shift is timing. Several benches are treating anticipatory bail as genuinely anticipatory.

None of this changes the underlying test — flight risk, tampering risk, and the gravity of the allegation.`,
        },
        {
            id: "seed-2",
            tag: "Civil",
            title: "Injunctions in property disputes: the real standard",
            excerpt:
                "Courts ask three questions before granting a stay. Most petitions fail because they only answer one of them.",
            readTime: 7,
            date: "2023-11-14",
            content:
                "Most injunction petitions focus entirely on ownership. Courts actually apply three tests: prima facie case, balance of convenience and irreparable harm.",
        },
        {
            id: "seed-3",
            tag: "IP",
            title: "Trademark squatting: what founders get wrong",
            excerpt:
                "Filing late is rarely the mistake. Filing in the wrong class is.",
            readTime: 5,
            date: "2023-12-01",
            content:
                "Founders assume trademark squatting is a timing problem. In practice, the biggest mistake is filing in the wrong class.",
        },
        {
            id: "seed-4",
            tag: "Cyber",
            title: "Reporting a data breach: the 72-hour rule",
            excerpt:
                "What has to happen in the first three days after discovery.",
            readTime: 6,
            date: "2023-12-10",
            content:
                "The 72-hour clock starts at discovery, not when the breach occurred.",
        },
        {
            id: "seed-5",
            tag: "Taxation",
            title: "Faceless assessments: a taxpayer's working guide",
            excerpt:
                "How to respond to a notice under the faceless assessment scheme.",
            readTime: 8,
            date: "2024-01-05",
            content:
                "Every notice should be answered with complete documentation the first time.",
        },
        {
            id: "seed-6",
            tag: "Corporate",
            title: "Shareholder agreements that survive a dispute",
            excerpt:
                "The clauses that matter are rarely the ones founders negotiate most.",
            readTime: 9,
            date: "2024-01-20",
            content:
                "Deadlock resolution, drag-along rights and leaver clauses are critical.",
        },
    ];

    const [articles] = useState(seedArticles);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTag, setActiveTag] = useState("All");
    const [selectedArticle, setSelectedArticle] = useState(null);

    const tags = useMemo(() => {
        return ["All", ...new Set(articles.map((a) => a.tag))];
    }, [articles]);

    const filteredArticles = useMemo(() => {
        return articles.filter((a) => {
            const tagMatch = activeTag === "All" || a.tag === activeTag;

            const searchMatch =
                (
                    a.title +
                    a.excerpt +
                    a.content +
                    a.tag
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
            {/* Header */}

            <header>
                <div className="wrap nav-inner">
                    <a href="/" className="logo">
                        <div className="seal-mark">LC</div>

                        <div className="logo-text">
                            <div className="name">Lex Corpus</div>
                            <div className="sub">Lawyers &amp; Associates</div>
                        </div>
                    </a>

                    <nav className="primary">
                        <a href="/">Home</a>
                        <a href="/practice">Practice</a>
                        <a href="/about">About</a>
                        <a href="/contactUs">Contact</a>
                    </nav>

                    <div className="nav-right">
                        <label className="search-box" htmlFor="searchInput">
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="11" cy="11" r="7" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>

                            <input
                                id="searchInput"
                                type="text"
                                placeholder="Search articles..."
                                autoComplete="off"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </label>

                        <a href="/#contact" className="btn btn-primary">
                            Consult
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero */}

            <section className="page-head">
                <div className="wrap">
                    <div className="eyebrow">Insights</div>

                    <h1>
                        Notes from <em>the practice</em>
                    </h1>

                    <p>
                        Articles from our associates on cases, rulings, and procedure — written
                        for clients, not just for counsel. Use the search bar above to find a
                        specific topic, or the tags below to browse by practice area.
                    </p>
                </div>
            </section>

            {/* Filter */}

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

                        <div className="result-count">
                            {filteredArticles.length}{" "}
                            {filteredArticles.length === 1 ? "article" : "articles"}
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}

            <section className="blog-grid">
                <div className="wrap">

                    {filteredArticles.length === 0 ? (
                        <div className="empty-state">
                            <span className="serif">No articles found</span>
                            <p>
                                Try a different search term or tag, or add a new article.
                            </p>
                        </div>
                    ) : (
                        <div className="grid">
                            {filteredArticles.map((article) => (
                                <article
                                    key={article.id}
                                    className="card"
                                    onClick={() => setSelectedArticle(article)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="card-top">
                                        <span className="insight-tag">{article.tag}</span>
                                    </div>

                                    <h3>{article.title}</h3>

                                    <p>{article.excerpt}</p>

                                    <div className="card-meta">
                                        <span>{formatDate(article.date)}</span>
                                        <span>{article.readTime} min read</span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                </div>
            </section>

            {/* Floating Button */}

            <a
                className="fab"
                href="/admin"
                title="Only accessible if you're logged in"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>

                <span>Manage articles</span>
            </a>


            {/* Article Detail */}

            {selectedArticle && (
                <div className="detail-overlay open">
                    <div className="detail-header">
                        <div className="wrap">
                            <button
                                className="back-link"
                                onClick={() => setSelectedArticle(null)}
                            >
                                &larr; Back to all articles
                            </button>
                        </div>
                    </div>

                    <div className="detail-body">
                        <div className="wrap">

                            <div className="detail-tag">
                                <span className="insight-tag">
                                    {selectedArticle.tag}
                                </span>
                            </div>

                            <h1>{selectedArticle.title}</h1>

                            <div className="detail-meta">
                                <span>{formatDate(selectedArticle.date)}</span>
                                <span>{selectedArticle.readTime} min read</span>
                            </div>

                            <div className="detail-content">
                                {selectedArticle.content
                                    .split("\n")
                                    .filter((p) => p.trim() !== "")
                                    .map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}

            <footer>
                <div className="wrap">
                    <div className="footer-bottom">
                        <span>
                            © 2023 Lex Corpus, Lawyers &amp; Associates. All rights reserved.
                        </span>

                        <span>
                            Attorney advertising. Prior results do not guarantee a similar outcome.
                        </span>
                    </div>
                </div>
            </footer>

        </>
    );
}