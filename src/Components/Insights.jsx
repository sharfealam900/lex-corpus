import React from 'react'
import Navbar from './Navbar'

export default function Insights() {
  return (
    <>
     {/* <Navbar/> */}
    <section className="insights" id="insights">
                <div className="wrap">
                    <div className="section-head">
                        <div className="eyebrow">Insights</div>
                        <h2>Notes from the practice</h2>
                        <p>Short reads from our associates on cases, rulings, and procedure worth knowing about — written for clients, not just for counsel. <a
                            href="blog.html"
                            style={{
                                color: "var(--seal)",
                                borderBottom: "1px solid var(--seal-dim)",
                            }}
                        >
                            Read the full blog &rarr;
                        </a></p>
                    </div>
                    <div className="insight-grid">
                        <article className="insight-card">
                            <span className="insight-tag">Criminal</span>
                            <h3>Anticipatory bail: what actually changed in procedure</h3>
                            <p>A plain-language walkthrough of how courts are applying the revised criminal procedure code to bail applications.</p>
                            <div className="insight-meta"><span>Art. I</span><span>6 min read</span></div>
                        </article>
                        <article className="insight-card">
                            <span className="insight-tag">Civil</span>
                            <h3>Injunctions in property disputes: the real standard</h3>
                            <p>Courts ask three questions before granting a stay. Most petitions fail because they only answer one of them.</p>
                            <div className="insight-meta"><span>Art. II</span><span>7 min read</span></div>
                        </article>
                        <article className="insight-card">
                            <span className="insight-tag">IP</span>
                            <h3>Trademark squatting: what founders get wrong</h3>
                            <p>Filing late is rarely the mistake. Filing in the wrong class, for the wrong goods, is what costs founders their mark.</p>
                            <div className="insight-meta"><span>Art. III</span><span>5 min read</span></div>
                        </article>
                        <article className="insight-card">
                            <span className="insight-tag">Cyber</span>
                            <h3>Reporting a data breach: the 72-hour rule</h3>
                            <p>What has to happen in the first three days after discovery, and who is actually required to be notified.</p>
                            <div className="insight-meta"><span>Art. IV</span><span>6 min read</span></div>
                        </article>
                        <article className="insight-card">
                            <span className="insight-tag">Taxation</span>
                            <h3>Faceless assessments: a taxpayer's working guide</h3>
                            <p>How to respond to a notice under the faceless assessment scheme without a call, a meeting, or a familiar officer.</p>
                            <div className="insight-meta"><span>Art. V</span><span>8 min read</span></div>
                        </article>
                        <article className="insight-card">
                            <span className="insight-tag">Corporate</span>
                            <h3>Shareholder agreements that survive a dispute</h3>
                            <p>The clauses that matter are rarely the ones founders spend the most time negotiating. A drafting checklist.</p>
                            <div className="insight-meta"><span>Art. VI</span><span>9 min read</span></div>
                        </article>
                    </div>
                </div>
            </section>
    </>
  )
}
