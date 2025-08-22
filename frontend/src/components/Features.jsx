import React from 'react'
import { FaUserTie, FaClock, FaUserFriends } from 'react-icons/fa'
import { BsClipboardFill } from 'react-icons/bs'

const Features = () => {
    return (
        <section className='mx-auto max-w-[1140px] px-6 lg:px-12 relative bottom-12'>
            <div className='flex flex-wrap gap-x-4 bg-light rounded-3xl p-8'>
                <div className='flex flex-col gap-y-2 p-4 rounded-xl max-w-[233px]'>
                    <FaUserTie className='text-xl mb-2'/>
                    <h5>Qualified Instructors</h5>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className='flex flex-col gap-y-2 p-4 rounded-xl max-w-[233px] bg-secondary'>
                    <FaClock className='text-xl mb-2'/>
                    <h5>24/7 Availability</h5>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className='flex flex-col gap-y-2 p-4 rounded-xl max-w-[233px]'>
                    <BsClipboardFill className='text-xl mb-2'/>
                    <h5>Interactive Whiteboards</h5>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className='flex flex-col gap-y-2 p-4 rounded-xl max-w-[233px]'>
                    <FaUserFriends className='text-xl mb-2'/>
                    <h5>1-on-1 live sessions</h5>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
            </div>
        </section>
    )
}

export default Features