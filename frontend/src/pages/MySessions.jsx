import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext';

const MySessions = () => {

    const {tutors, currency, token} = useContext(AppContext)

    return (
        <div className='max-padd-container py-28'>
            {tutors.map((tutor, i)=>(
                <div key={i} className='bg-white px-6 py-3 mb-2 rounded-lg'>
                    <div className='flex gap-x-3 w-full'>
                        {/* Image */}
                        <div className="relative max-h-32 max-w-28 overflow-hidden rounded-lg">
                            <img src={tutor.image} alt="TutImg" className='object-contain'/>
                            {/* Overlay */}
                            <div className='absolute inset-0 bg-black/15' />
                        </div>
                        {/* Session Info */}
                        <div className='block w-full'>
                            <h5 className='h5 capitalize line-clamp-1'>{tutor.name}</h5>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>{tutor.qualification}</p>
                                    <div className="flex items-center gap-x-2">
                                        <h4 className='medium-14'>Subject</h4>
                                        <p>{tutor.subject}</p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-x-2">
                                        <h4 className='medium-14'>Address:</h4>
                                        <p>{tutor.location?.city}</p>
                                        <p>{tutor.location?.country}</p>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <h4 className='medium-14'>Fee</h4>
                                        <p>{currency}{tutor.fees}</p>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <h4 className='medium-14'>Date & Time</h4>
                                        <p>18/5/2025 | 10:30 AM</p>
                                    </div>
                                </div>

                                {/* Status & Button */}
                                <button className='btn-ghost max-md:!px-1 !py-1 !text-xs !rounded'>Make Payment</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MySessions;