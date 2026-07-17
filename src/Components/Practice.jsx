import React from 'react'
import Navbar from './Navbar'

export default function Practice() {
  return (
   <>
    {/* <Navbar/> */}
   <section className="practice" id="practice">
                <div className="wrap">
                    <div className="section-head">
                        <div className="eyebrow">The corpus</div>
                        <h2>Seven articles of practice</h2>
                        <p>Our associates are organised by field, not by seniority — every matter is routed to counsel who practise it daily.</p>
                    </div>
                    <div className="articles">
                        <div className="article-row">
                            <div className="article-num">I</div>
                            <h3>Criminal law</h3>
                            <p>Defence and representation across criminal proceedings — from the first FIR through trial, bail, and appeal.</p>
                        </div>
                        <div className="article-row">
                            <div className="article-num">II</div>
                            <h3>Civil litigation</h3>
                            <p>Contract disputes, property and title matters, recovery suits, and injunctions before civil courts and tribunals.</p>
                        </div>
                        <div className="article-row">
                            <div className="article-num">III</div>
                            <h3>Intellectual property</h3>
                            <p>Trademark and copyright registration, patent prosecution, licensing agreements, and enforcement against infringement.</p>
                        </div>
                        <div className="article-row">
                            <div className="article-num">IV</div>
                            <h3>Cyber enforcement &amp; data law</h3>
                            <p>Cybercrime defence and complaint filing, data breach response, digital evidence, and compliance with data protection law.</p>
                        </div>
                        <div className="article-row">
                            <div className="article-num">V</div>
                            <h3>Taxation</h3>
                            <p>Direct and indirect tax advisory, assessment representation, appeals, and dispute resolution before tax authorities.</p>
                        </div>
                        <div className="article-row">
                            <div className="article-num">VI</div>
                            <h3>Corporate &amp; commercial</h3>
                            <p>Incorporation, commercial contracts, mergers and acquisitions, regulatory compliance, and corporate governance advisory.</p>
                        </div>
                        <div className="article-row">
                            <div className="article-num">VII</div>
                            <h3>Matrimonial &amp; family law</h3>
                            <p>Divorce and separation, child custody, maintenance, and negotiated family settlements, handled with discretion.</p>
                        </div>
                    </div>
                </div>
            </section>
   </>
  )
}
