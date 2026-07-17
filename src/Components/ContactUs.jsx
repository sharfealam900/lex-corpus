import React from 'react'
import Navbar from './Navbar'

export default function ContactUs() {
  return (
    <>
     {/* <Navbar/> */}
     <section className="contact" id="contact">
                <div className="wrap contact-grid">
                    <div className="contact-info">
                        <div className="eyebrow">Get in touch</div>
                        <h2>State your matter</h2>
                        <p>Tell us briefly what's happened and what you need. An associate from the relevant practice group will review it and respond within one business day — every submission is confidential.</p>
                        <ul className="info-list">
                            <li><span className="k">Office</span><span className="v">4th Floor, Fatima Apartment<span>Jamia Nagar, New Delhi 110025</span></span></li>
                            <li><span className="k">Phone</span><span className="v">+91 7834818160<span>Mon–Sat, 9:30am–10:00pm IST</span></span></li>
                            <li><span className="k">Email</span><span className="v">lexcorpuservice.gmail.com<span>For new matters and general queries</span></span></li>
                        </ul>
                    </div>

                    <form className="brief-form" id="briefForm">
                        <div className="form-row">
                            <div className="field">
                                <label htmlFor="name">Full name</label>
                                <input id="name" type="text" placeholder="Your name" required />
                            </div>
                            <div className="field">
                                <label htmlFor="phone">Phone number</label>
                                <input id="phone" type="tel" placeholder="+91 98XXX XXXXX" required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="field">
                                <label htmlFor="email">Email address</label>
                                <input id="email" type="email" placeholder="you@email.com" required />
                            </div>
                            <div className="field">
                                <label htmlFor="area">Practice area</label>
                                <select id="area" required>
                                    <option value="" disabled>Select an area</option>
                                    <option>Criminal law</option>
                                    <option>Civil litigation</option>
                                    <option>Intellectual property</option>
                                    <option>Cyber enforcement &amp; data law</option>
                                    <option>Taxation</option>
                                    <option>Corporate &amp; commercial</option>
                                    <option>Matrimonial &amp; family law</option>
                                    <option>Not sure — advise me</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="field full">
                                <label htmlFor="brief">Brief of matter</label>
                                <textarea id="brief" placeholder="Describe what happened, when, and what you're looking to achieve. Include any dates, notices, or filings already in motion." required></textarea>
                            </div>
                        </div>
                        <div className="submit-row">
                            <span className="note">By submitting, you agree this does not yet create an attorney-client relationship.</span>
                            <button type="submit" className="submit-btn">Submit brief</button>
                        </div>
                    </form>
                </div>
            </section>

    </>
  )
}
