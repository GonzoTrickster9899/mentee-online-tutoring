import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from "axios";
import { toast } from "react-toastify";

const MySessions = () => {
    const {tutors, currency, token, backendUrl, getTutorsData } = 
        useContext(AppContext);
    const [sessions, setSessions] = useState([])

    const getUserSessions = async ()=> {
        try {
            const {data} = await axios.get(backendUrl + "/api/user/sessions", {
                headers:{ token },
            });
            if (data.success) {
                setSessions(data.sessions.reverse());
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const cancelSession = async (sessionId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/user/cancel-session', {sessionId}, {headers:{token}})
            
            if(data.success){
                toast.success(data.message)
                getUserSessions()
                getTutorsData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);

        }
    }

    const sessionStripe = async(sessionId)=>{
        try{
            const {data} = await axios.post(backendUrl + "/api/user/payment-stripe", {sessionId}, {headers:{token}})
            if(data.success){
                window.location.href = data.session_url
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        const updatePaymentStatus = async ()=>{
            try {
                const currentUrl = new URL(window.location.href)
                const success = currentUrl.searchParams.get('success')
                const sessionId = currentUrl.searchParams.get('sessionId')

                if(success === "true" && sessionId){
                    const {data} = await axios.get(`${backendUrl}/api/user/verify-stripe?sessionId=${sessionId}`, {headers:{token}})

                    if(data.success){
                        toast.success('Payment successful')
                        getUserSessions()
                        // Remove query params from url
                        window.history.replaceState({}, document.title, "/my-sessions")
                    } 
                }
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

        if(token && backendUrl) {
            updatePaymentStatus()
        }
    }, [token, backendUrl, getUserSessions])

    useEffect(() => {
        if(token){
            getUserSessions()
        }
    }, [token]);

    return (
        <div className='max-padd-container py-28'>
            {sessions.map((session, i)=>(
                <div key={i} className='bg-white px-6 py-3 mb-2 rounded-lg'>
                    <div className='flex gap-x-3 w-full'>
                        {/* Image */}
                        <div className="relative max-h-32 max-w-28 overflow-hidden rounded-lg">
                            <img 
                                src={session.tutData.image} 
                                alt="TutImg" 
                                className='object-contain'
                            />
                            {/* Overlay */}
                            <div className='absolute inset-0 bg-black/15' />
                        </div>
                        {/* Session Info */}
                        <div className='block w-full'>
                            <h5 className='h5 capitalize line-clamp-1'>
                                {session.tutData.name}
                            </h5>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>{session.tutData.qualification}</p>
                                    <div className="flex items-center gap-x-2">
                                        <h4 className='medium-14'>Subject</h4>
                                        <p>{session.tutData.subject}</p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-x-2">
                                        <h4 className='medium-14'>Address:</h4>
                                        <p>{session.tutData.location?.city}</p>
                                        <p>{session.tutData.location?.country}</p>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <h4 className='medium-14'>Fee</h4>
                                        <p>
                                            {currency}
                                            {session.tutData.fees}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <h4 className='medium-14'>Date & Time</h4>
                                        <p>
                                            {session.slotDate} | {session.slotTime}
                                        </p>
                                    </div>
                                </div>
                                {/* Status & Button */}
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => sessionStripe(session._id)} disabled={session.payment || session.isCompleted} className={`${(session.cancelled) ? "hidden" : "block"} disabled:cursor-not-allowed disabled:text-green-500 ${session.payment || session.isCompleted ? "btn-ghost" : "btn-light"} max-md:!px-1 !py-1 !text-xs !rounded`}>
                                        {session.isCompleted ? "Completed" : session.payment ? "Paid" : "Pay"}
                                    </button>
                                    <button onClick={() => cancelSession(session._id)} disabled={session.cancelled} className={`${session.isCompleted || session.payment ? "hidden" : "block"} disabled:cursor-not-allowed disabled:text-red-500 ${session.cancelled ? "btn-ghost" : "btn-light"} max-md:!px-1 !py-1 !text-xs !rounded`}>
                                        {session.cancelled ? "Cancelled" : "Cancel"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MySessions;