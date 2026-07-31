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
  <div className="wrap">

    <div className="about-content">

      <div className="eyebrow">
        {settings.aboutTitle}
      </div>

      <h2>{settings.aboutHeading}</h2>

      <p>{settings.aboutDescription}</p>

    </div>

  </div>
</section>
    </>
  )
}
