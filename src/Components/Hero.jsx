import React from 'react'
import Navbar from './Navbar'

export default function Hero() {
  return (
    
    <>
     {/* <Navbar/> */}
      <section className="hero">
                <div className="wrap hero-inner">
                    <div>
                        <div className="eyebrow">
                            Lex Corpus — Lawyers &amp; Associates
                        </div>

                        <h1 className="hero-title">
                            Every matter argued <em>on its merits</em>
                        </h1>

                        <p className="hero-lede">
                            A full-service law firm advising individuals, families, and
                            enterprises across seven areas of practice — from criminal defence
                            to corporate advisory. Read our brief before you write yours.
                        </p>

                        <div className="hero-actions">
                            <a href="#contact" className="btn btn-primary">
                                State your matter
                            </a>

                            <a
                                href="#practice"
                                className="btn btn-outline"
                                style={{
                                    borderColor: "rgba(242,239,230,0.4)",
                                    color: "var(--cream)",
                                }}
                            >
                                View practice areas
                            </a>
                        </div>
                    </div>
                </div>
            </section>
    </>
  )
}
