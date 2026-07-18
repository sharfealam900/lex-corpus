import React from "react";
import Hero from "../Hero";
import Practice from "../Practice";
import About from "../About";
import Insights from "../Insights";
import ContactUs from "../ContactUs";
import Navbar from "../Navbar";
import Footer from "../Footer";


 

export default function Home() {
    return (
        <>
        <Navbar/>
        
          <Hero/>
          <Practice/>
          <About/>
          <Insights/>
          <ContactUs/>

          <Footer/>

        </>

    );
}