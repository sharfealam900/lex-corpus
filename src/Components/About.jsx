import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { SETTING_API } from "../utils/constant";
import axios from 'axios';

export default function About() {
  const [settings, setSettings] = useState({
    aboutTitle: "",
    aboutHeading: "",
    aboutDescription: "",
    aboutMission: "",
    aboutVision: "",
    aboutExperience: "",
    aboutCasesWon: "",
    aboutHappyClients: "",
    aboutExpertLawyers: "",
  })

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(SETTING_API);

      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <>
      {/* <Navbar/> */}
      <section className="about" id="about">
        <div className="wrap about-grid">
          {/* <div>
            <div className="eyebrow">About the firm</div>
            <h2>Counsel built around the matter, not the department</h2>
            <p>Lex Corpus was founded on a simple premise: a client with a tax dispute and a client fighting a custody case deserve the same depth of attention. We keep our practice groups small and specialised rather than stacking generalists, so the associate who drafts your brief is the one who argues it.</p>
            <p>We take on individuals, founders, and enterprises alike — and we tell you plainly, at the first meeting, whether a matter is worth pursuing.</p>
          </div> */}


          <div>
            <div className="eyebrow">{settings.aboutTitle}</div>

            <h2>{settings.aboutHeading}</h2>

            <p>{settings.aboutDescription}</p>
          </div>

          {/* <h4>Our Mission</h4>
          <p>{settings.aboutMission}</p>

          <h4>Our Vision</h4>
          <p>{settings.aboutVision}</p> */}


          {/* <div>{settings.aboutExperience}+ Years Experience</div>
          <div>{settings.aboutCasesWon}+ Cases Won</div>
          <div>{settings.aboutHappyClients}+ Happy Clients</div>
          <div>{settings.aboutExpertLawyers}+ Expert Lawyers</div> */}



        </div>
      </section>

    </>
  )
}
