import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section className="max-padd-container bg-hero bg-cover bg-center bg-no-repeat h-[711px] w-full relative">
            <div className="pt-44 xl:pt-52 max-w-[677px] text-white">
                <span className="ring-1 ring-white/30 max-w-72 px-3 rounded-3xl">
                    <span className="text-secondary pr-1">#1</span>Trusted Online Tutoring Platform
                </span>
                <h1 className="h1 max-w-[44rem] mt-6">Personalized 1-on-1 Tutoring for Every Learner, Anytime, Anywhere</h1>
                <p className="text-gray-10">Experience expert guideline with our advanced platform that connects students with top tutors across a range of subjects built for results, flexibility and growth.</p>
                <div className='mt-8'>
                    <Link to="/login" className="btn-light !bg-transparent !ring-white !py-3">
                    Register Now
                    </Link>
                    <Link to="/login" className="btn-secondary !text-tertiary !py-3 ml-3">
                    Book Session
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Hero;