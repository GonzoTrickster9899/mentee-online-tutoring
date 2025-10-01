import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'

const AllSessions = () => {

  const {sessions, getAllSessions, aToken, cancelSession} = useContext(AdminContext)
  const {currency, calculateAge } = useContext(AppContext)

  useEffect(()=>{
    if(aToken){
      getAllSessions()
      console.log(sessions)
    }
  }, [aToken])


  return (
    <div className='px-2 sm:px-8 py-12 h-screen sm:pl-[23%]'>
      <div className='max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className="hidden md:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] grid-flow-col px-6 py-3 mb-4 bg-deep text-white items-center rounded text-[14px] font-medium">
          <h5>#</h5>
          <h5>Client</h5>
          <h5>Age</h5>
          <h5>Tutor</h5>
          <h5>Date & Time</h5>
          <h5>Fees</h5>
          <h5>Status</h5>
        </div>
        {[...sessions].reverse().map((session, i)=>(
          <div key={i} className='flex flex-wrap justify-between gap-2 md:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] grid-flow-col px-6 py-3 mb-1 bg-white items-center rounded text-[13px] font-medium'>
            <h5 className="h5 sm:hidden md:flex">{i + 1}</h5>
            <div className="flexStart gap-x-1">
              <div className="relative overflow-hidden rounded-full">
                <img src={session.userData.image} alt="" className='rounded-full w-10 aspect-square object-contain'/>
                <span className='inset-0 bg-black/10 absolute' />
              </div>
              <p>{session.userData.name}</p>
            </div>
            <p className='sm:hidden md:flex'>{calculateAge(session.userData.dob)}</p>
            <div className="flexStart gapx-x-1">
              <div className='relative overflow-hidden rounded-full'>
                <img src={session.tutData.image} alt="" className='rounded-full w-10 aspect-square object-contain' />
                <span className='inset-0 bg-black/10 absolute'/>
              </div>
              <p>{session.tutData.name}</p>
            </div>
            <p className='max-lg:text-[12px]'>{session.slotDate}, {session.slotTime}</p>
            <p>{currency}{session.amount}</p>
            <div className='flex flex-col gap-2'>
              <button onClick={() => cancelSession(session._id)} disabled={session.cancelled} className={`${session.isCompleted ? "hidden" : "block"} disabled:text-red-500 ${session.cancelled ? "btn-ghost" : "btn-light"} max-md:!px-1 !py-1 !text-xs !rounded`}>
                  {session.cancelled ? "Cancelled" : "Cancel"}
              </button>
              <button disabled={session.isCompleted} className={`${!session.isCompleted ? "hidden" : "block"} disabled:cursor-not-allowed disabled:text-green-500 max-md:!px-1 !py-1 !text-xs !rounded`}>
                  {session.cancelled ? "Cancelled" : "Cancel"}
              </button>                 
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllSessions