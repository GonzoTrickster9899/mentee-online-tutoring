import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { FaStar } from 'react-icons/fa'

const SimilarTutors = ({tutId, subject}) => {
    
    const {tutors, navigate} = useContext(AppContext)
    const [simTutors, setSimTutors] = useState([])

    useEffect(()=>{
        if(tutors.length > 0 && subject){
            const tutData = tutors.filter((tutor)=>tutor.subject === subject && tutor._id !== tutId)

            setSimTutors(tutData)
        }
    }, [tutors, subject, tutId])

    {/* 
    useEffect(()=>{
        console.log("Similar Tutors:", simTutors)
    }, [simTutors])
    */}

    return (
        <section className='pt-16 xl:pt-32'>
            {/*Title*/}
            <div className='max-w-xl mx-auto text-center pb-16'>
                <div className='h3'>
                    <div className='inline-flex flexCenter gap-2 flex-wrap capitalize'>Tutors with Similar Expertise</div>
                </div>
                <p>Our platform is designed to empower professional tutors who are passionate about sharing knowledge and shaping futures.</p>
            </div>

            {/* Container */}
            <div className='grid grid-col-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-x-10 sm:gap-y-12'>
                {simTutors.slice(0,5).map((tutor,i)=>(
                    <div key={i} className='rounded-xl overflow-hidden relative group'>
                        <div>
                            <img src={tutor.image} alt="" className='overflow-hidden'/>
                            <div className='absolute top-0 left-0 h-ful w-full bg-black/15'></div>
                        </div>
                        <div className='p-3 absolute bottom-0 text-white group-hover:hidden'>
                            <span className='flex items-baseline gap-x-1 medium-14'>
                                <FaStar className='text-yellow-200'/>4.8
                            </span>
                            <h5 className='h5'>{tutor.name}</h5>
                            <p className='text-white/80'>{tutor.subject}</p>
                        </div>
                        <div className='absolute inset-0 flex items-end bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 z-10'>
                            <div className='flex flex-col w-full gap-2 p-4'>
                                <button onClick = {()=>{navigate(`/session/${tutor._id}`), scrollTo(0,0)}} className='btn-white !font-bold !text-xs !p-2'>View Profile</button>
                                <button onClick = {()=>{navigate(`/tutors`), scrollTo(0,0)}} className='btn-white !font-bold !text-xs !p-2'>Explore Tutors</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default SimilarTutors