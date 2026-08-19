import React from 'react'
import Navbar from './Navbar'
import { useEffect, useState } from "react";
import axios from "axios";
import { PRACTICE_API_END_POINT } from "../utils/constant";

export default function Practice() {
    const [practices, setPractices] = useState([]);
    const fetchPractices = async () => {
        try {
            const { data } = await axios.get(PRACTICE_API_END_POINT);

            if (data.success) {
                setPractices(data.practices);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchPractices();
    }, []);


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


                        <div className="articles">
                            {practices.map((practice, index) => (
                                <div className="article-row" key={practice._id}>
                                    <div className="article-num">{index + 1}</div>

                                    <h3>{practice.title}</h3>

                                    <p>{practice.description}</p>
                                </div>
                            ))}
                        </div>




                    </div>
                </div>
            </section>
        </>
    )
}
