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
    }
  }, [aToken])

  const getStatus = (session) => {
    if(session.cancelled) return "Cancelled";
    if(session.isCompleted) return "Completed";
    if(session.paymentStatus === "paid") return "Paid / scheduled";
    if(["checkout_creating", "checkout_created"].includes(session.paymentStatus)) return "Payment pending";
    if(session.paymentStatus === "failed") return "Payment failed";
    if(session.paymentStatus === "expired") return "Checkout expired";
    return "Pending payment";
  };
  const canCancel = (session) => !session.cancelled && !session.isCompleted && ["unpaid", "failed", "expired"].includes(session.paymentStatus || "unpaid");


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
        {sessions.length === 0 && <p className="p-4">No sessions found.</p>}
        {sessions.map((session, i)=>(
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
              <p className="text-xs">{getStatus(session)}</p>
              <button onClick={() => cancelSession(session._id)} disabled={!canCancel(session)} className={`${session.isCompleted || session.cancelled ? "hidden" : "block"} disabled:cursor-not-allowed disabled:opacity-60 btn-light max-md:!px-1 !py-1 !text-xs !rounded`}>
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
