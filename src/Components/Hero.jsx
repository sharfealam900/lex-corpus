import React, { useEffect, useState } from "react";
import axios from "axios";
import { SETTING_API } from "../utils/constant";

export default function Hero() {
  const [settings, setSettings] = useState({
    websiteName: "Lex Corpus",
    tagline: "Lawyers & Associates",
    heroTitle: "Every matter argued on its merits",
    heroSubtitle:
      "A full-service law firm advising individuals, families, and enterprises across seven areas of practice.",
    heroButtonText: "State your matter",
    heroButtonLink: "/contactUs",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

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

  return (
    <section className="hero">
      <div className="wrap hero-inner">
        <div>

          <div className="eyebrow">
            {settings.websiteName} — {settings.tagline}
          </div>

          <h1 className="hero-title">
            {settings.heroTitle}
          </h1>

          <p className="hero-lede">
            {settings.heroSubtitle}
          </p>

          <div className="hero-actions">

          <div>
              <a
              href="#practice"
              className="btn btn-outline"
              style={{
                borderColor: "rgba(242,239,230,0.4)",
                color: "var(--cream)",
              }}
            >
              View Practice Areas
            </a>
          </div>

          </div>

        </div>
      </div>
    </section>
  );
}