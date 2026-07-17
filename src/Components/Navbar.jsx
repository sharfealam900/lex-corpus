import React from 'react'
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="header">
      <div className="wrap nav-inner">
        <div className="logo">
          <div className="seal-mark">LC</div>

          <div className="logo-text">
            <div className="name">Lex Corpus</div>
            <div className="sub">Lawyers & Associates</div>
          </div>
        </div>

        <nav className="primary">
          <NavLink to="/blog">Blogs</NavLink>
          <a href="#practice" >Practice </a>
          <a href="#about" >About </a>
          <a href="#insights" >Insights </a>
          <a href="/contactUs" >Contact </a>
        </nav>



        <a href="#contact" className="btn btn-primary">
          Book a consultation
        </a>
      </div>
    </header>
  );
}
