import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from "axios";
import { toast } from "react-toastify";

const MySessions = () => {
    const {currency, token, backendUrl, getTutorsData} =
        useContext(AppContext);
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadError, setLoadError] = useState("")

    const getUserSessions = useCallback(async ()=> {
        setLoading(true)
        setLoadError("")
        try {
            const {data} = await axios.get(backendUrl + "/api/user/sessions", {
                headers:{ token },
            });
            if (data.success) {
                setSessions(data.sessions);
            } else {
                setLoadError(data.message || "Unable to load sessions");
            }
        } catch (error) {
            const message = error.response?.data?.message || "Unable to load sessions";
            setLoadError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [backendUrl, token]);

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
            toast.error(error.response?.data?.message || "Unable to cancel this session");

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
            toast.error(error.response?.data?.message || "Unable to start checkout");
        }
    }

    useEffect(()=>{
        if(!token) return;
        const currentUrl = new URL(window.location.href);
        if(currentUrl.searchParams.get('checkout') === "success"){
            toast.info("Checkout returned. Payment confirmation will appear after secure verification.");
            window.history.replaceState({}, document.title, "/my-sessions");
        }
        getUserSessions();
    }, [token, getUserSessions]);

    const getStatus = (session) => {
        if(session.cancelled) return "Cancelled";
        if(session.isCompleted) return "Completed";
        if(session.paymentStatus === "paid") return "Paid / confirmed";
        if(session.paymentStatus === "checkout_creating" || session.paymentStatus === "checkout_created") return "Payment pending";
        if(session.paymentStatus === "failed") return "Payment failed";
        if(session.paymentStatus === "expired") return "Checkout expired";
        if(session.paymentStatus === "legacy_paid_unverified") return "Payment verification pending";
        return "Pending payment";
    };

    const canPay = (session) => !session.cancelled && !session.isCompleted && ["unpaid", "failed", "expired"].includes(session.paymentStatus || "unpaid");
    const canCancel = (session) => !session.cancelled && !session.isCompleted && ["unpaid", "failed", "expired"].includes(session.paymentStatus || "unpaid");

    return (
        <div className='max-padd-container py-28'>
            <h1 className="h2 mb-5">My Sessions</h1>
            {loading && <p role="status">Loading your sessions…</p>}
            {loadError && <div role="alert"><p>{loadError}</p><button className="btn-secondary mt-3" onClick={getUserSessions}>Try again</button></div>}
            {!loading && !loadError && sessions.length === 0 && <p>You have no sessions yet.</p>}
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
                                        <p>{session.tutData.address?.city}</p>
                                        <p>{session.tutData.address?.country}</p>
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
                                    <p className="text-xs font-semibold" aria-label={`Session status: ${getStatus(session)}`}>{getStatus(session)}</p>
                                    <button onClick={() => sessionStripe(session._id)} disabled={!canPay(session)} className={`${session.cancelled ? "hidden" : "block"} disabled:cursor-not-allowed disabled:opacity-60 btn-light max-md:!px-1 !py-1 !text-xs !rounded`}>
                                        Pay securely
                                    </button>
                                    <button onClick={() => cancelSession(session._id)} disabled={!canCancel(session)} className={`${session.isCompleted || session.cancelled ? "hidden" : "block"} disabled:cursor-not-allowed disabled:opacity-60 btn-light max-md:!px-1 !py-1 !text-xs !rounded`}>
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
