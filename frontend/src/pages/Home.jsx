import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Subjects from "../components/Subjects";
import FeaturedTutors from "../components/FeaturedTutors";
import About from "../components/About";

const Home = () => {
    return (
        <>
            <Hero />
            <Features />
            <Subjects />
            <FeaturedTutors />
            <About />
        </>
    )
}

export default Home;