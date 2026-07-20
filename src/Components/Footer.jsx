import React from 'react'

export default function Footer() {
  return (
    <div className="wrap">
      <div className="footer-grid ">
        <div className="footer-brand">
          <div className="name">Lex Corpus</div>
          <p>Lawyers &amp; Associates. Full-service legal counsel across criminal, civil, IP, cyber, tax, corporate, and matrimonial law.</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <div className="label">Practice</div>
            <a href="#practice">Criminal law</a>
            <a href="#practice">Civil litigation</a>
            <a href="#practice">Intellectual property</a>
            <a href="#practice">Cyber enforcement</a>
            <a href="#practice">Taxation</a>
            <a href="#practice">Corporate & commercial</a>
            <a href="#practice">Matrimonial & family law</a>
          </div>
          <div className="footer-col ">
            <div className="label">Firm</div>
            <a href="#about">About</a>
            <a href="#insights">Insights</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2023 Lex Corpus, Lawyers &amp; Associates. All rights reserved.</span>
        <span>Attorney advertising. Prior results do not guarantee a similar outcome.</span>
      </div>
    </div>
  )
}
