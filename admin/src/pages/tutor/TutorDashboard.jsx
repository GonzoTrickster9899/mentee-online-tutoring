import React from 'react'
import { useContext } from 'react'
import { TutorContext } from '../../context/TutorContext'
import { AppContext } from '../../context/AppContext'
import { useEffect } from 'react'
import earnings from "../../assets/earnings.png"
import client from "../../assets/client.png"
import session from "../../assets/session.png"
import latest from "../../assets/latest.png"

const TutorDashboard = () => {

  const {dashData, getDashData, tToken, completeSession, cancelSession} = useContext(TutorContext)
  const {currency} = useContext(AppContext)

  useEffect(()=>{
    if(tToken){
      getDashData()
    }
  }, [tToken])

  return (
    dashData && (
      <div className='px-2 sm:px-8 py-12 h-screen sm:pl-[23%] lg:w-11/12'>
        {/* Container for earning clients & sessions box */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flexStart gap-7 p-5 bg-[#d5eedd] lg:min-w-56 rounded">
            <img src={earnings} alt="" className='hidden sm:flex w-8'/>
            <div>
              <div className="bold-16">{currency}{dashData.earnings}</div>
              <p className="h5 text-gray-40">Earnings</p>
            </div>
          </div>
          <div className="flexStart gap-7 p-5 bg-[#fff4d2] lg:min-w-56 rounded">
            <img src={client} alt="" className='hidden sm:flex w-8'/>
            <div>
              <div className='bold-16'>{dashData.clients}</div>
              <p className='h5'>Clients</p>
            </div>
          </div>
          <div className="flexStart gap-7 p-5 bg-[#d1e8ff] lg:min-w-56 rounded">
            <img src={session} alt="" className='hidden sm:flex w-8'/>
            <div>
              <div className='bold-16'>{dashData.sessions}</div>
              <p className='h5'>Sessions</p>
            </div>
          </div>
        </div>
        {/* LATEST SESSIONS */}
        <div className='mt-4'>
          <div className='flex gap-3 px-6 py-3 mb-4 bg-deep text-white items-center rounded'>
            <img src={latest} alt="" className='w-8 invert-[100%]'/>
            <h5 className='h5'>Latest Sessions</h5>
          </div>
          <div>
            {dashData.latestSessions.map((session, i) => (
              <div 
                key={i} 
                className="flex flex-wrap justify-between gap-2 sm:grid grid-cols-[2fr_2fr_1fr] px-6 py-3 mb-1 bg-white items-center rounded text-[13px] font-medium'"
              >
                <div className="flex items-center gap-8">
                  <h5 className="h5 sm:hidden md:flex">{i + 1}</h5>
                  <div className="flexStart gap-x-2">
                    <div className="relative overflow-hidden rounded-full">
                      <img 
                        src={session.userData.image} 
                        alt="" 
                        className='rounded-full w-10 aspect-square object-contain'
                      />
                      <span className='inset-0 bg-black/10 absolute' />
                    </div>
                    <p>{session.userData.name}</p>
                  </div>
                </div>
                <p>
                  {session.slotDate}, {session.slotTime}
                </p>
                <div className='flex flex-col gap-2'>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => cancelSession(session._id)} 
                      disabled={session.cancelled} 
                      className={`${session.isCompleted ? "hidden" : "block"} disabled:cursor-not-allowed disabled:text-red-500 ${session.cancelled ? "btn-ghost" : "btn-light"} max-md:!py-1 !py-1 !text-xs !rounded`}
                    >
                      {session.cancelled ? "Cancelled" : "Cancel"}
                    </button>
                    <button onClick={() => completeSession(session._id)} disabled={session.isCompleted} className={`${session.cancelled ? "hidden" : "block"} disabled:cursor-not-allowed disabled:text-green-500 ${session.isCompleted ? "btn-ghost" : "btn-light"} max-md:!px-1 !py-1 !text-xs !rounded`}>
                        {session.isCompleted ? "Completed" : "Complete"}
                    </button>                  
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  )
}

export default TutorDashboard