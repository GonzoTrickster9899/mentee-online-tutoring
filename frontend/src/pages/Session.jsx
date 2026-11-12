import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6"
import SimilarTutors from '../components/SimilarTutors';
import { toast } from "react-toastify";
import axios from "axios";

const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const bookingTimeZone = import.meta.env.VITE_BOOKING_TIME_ZONE || "the configured booking time zone"

const Session = () => {
    const {tutId} = useParams()
    const {tutors, currency, navigate, getTutorsData, backendUrl, token, tutorsLoading, tutorsError } = useContext(AppContext)

    const [tutorInfo, setTutorInfo] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([])
    const [selectedDayIndex, setSelectedDayIndex] = useState(0)
    const [selectedTime, setSelectedTime] = useState("")

    // Get the tutor info
    useEffect(()=>{
        const tutor = tutors.find((t)=> t._id === tutId)
        setTutorInfo(tutor);
    },[tutors, tutId]);


    // Generate available slots
    useEffect (()=>{
        if(!tutorInfo) return
        
        const generateSlots = ()=>{
            const today = new Date()
            const slotsPerDay = []

            for(let i = 0; i < 7; i++){
                const date = new Date(today)
                date.setDate(today.getDate() + i);

                const daySlots = []
                const startTime = new Date(date);
                const endTime = new Date(date);

                // For today, start at the next available 30 min work at least 1 hour later
                if(i === 0){
                    startTime.setHours(Math.max(date.getHours() + 1, 10));
                    startTime.setMinutes(date.getMinutes() > 30 ? 30 : 0);
                } else {
                    startTime.setHours(10, 0, 0, 0);
                }

                endTime.setHours(21, 0, 0, 0);

                // Create slots every 30 minutes
                while(startTime < endTime){
                    const day = startTime.getDate();
                    const month = startTime.getMonth() + 1;
                    const year = startTime.getFullYear();
                    const slotDate = `${day}/${month}/${year}`;
                    const slotTime = startTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    });

                    //  Check if slot is Available (not booked)
                    const isSlotAvailable = !tutorInfo.slots_booked?.[slotDate]?.includes(slotTime)

                    if(isSlotAvailable){

                        daySlots.push({
                            datetime: new Date(startTime),
                            time: slotTime,
                            dateString: slotDate,
                        });
                    }

                    startTime.setMinutes(startTime.getMinutes() + 30);
                }
                slotsPerDay.push(daySlots);
            }

            setAvailableSlots(slotsPerDay);
        }

        generateSlots();
    }, [tutorInfo]);

    const bookSession = async () => {
        if(!token){
            toast.warn('Login to book session')
            return navigate('/login')
        }
        if(!tutorInfo?.available){
            toast.error("This tutor is not currently available")
            return
        }
        const selectedSlot = availableSlots[selectedDayIndex]?.find((slot) => slot.time === selectedTime)
        if(!selectedSlot){
            toast.warn("Choose an available time before booking")
            return
        }
        try {
            const slotDate = selectedSlot.dateString
            
            const {data} = await axios.post(backendUrl + "/api/user/book-session", {tutId, slotDate, slotTime: selectedTime}, {headers:{token}})

            if(data.success){
                toast.success(data.message)
                getTutorsData()
                navigate('/my-sessions')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to book this session")
        }
    }

    return (
        <div className="max-padd-container py-28">
            {tutorsLoading && <p role="status">Loading tutor availability…</p>}
            {tutorsError && <p role="alert">{tutorsError}</p>}
            {!tutorsLoading && !tutorsError && !tutorInfo && <p role="alert">This tutor could not be found.</p>}
            {tutorInfo && (
                <>
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-x-12 gap-5">
                        {/* Tutor Image */}
                        <div className="relative max-h-[444px] max-w-[444px] overflow-hidden rounded-lg">
                            <img 
                                src={tutorInfo.image} 
                                alt="tutorImg" 
                                className="object-contain"
                            />
                            {/* Overlay */}
                            <div className='absolute inset-0 bg-black/15'/>
                        </div>
                        {/* Tutor Details */}
                        <div className="">
                            <div className="flexBetween max-w-sm">
                                <div>
                                    <h3 className="bold-22">{tutorInfo.name}</h3>
                                    <h5 className="h5 font-semibold mb-1">{tutorInfo.qualification}</h5>
                                </div>
                                <span className="relative pl-5 pr-2 ring-1 ring-slate-900/10 rounded-full">
                                    <span className={`absolute top-1 left-1 h-2.5 w-2.5 rounded-full bg-green-500 ${
                                        tutorInfo.available ? "bg-green-500" : "bg-red-500"
                                        }`}
                                    />
                                    <p>{tutorInfo.available ? "Available" : "Unavailable"}</p>
                                </span>
                            </div>
                        
                            <div className="flexBetween rounded-3xl text-[13px] font-semibold max-w-sm ring-1 ring-slate-900/10 p-4 my-2">
                                <div className="flex flex-col gap-1">
                                    <h5>Experience</h5>
                                    <p>{tutorInfo.experience}</p>
                                </div>
                                <hr className="h-8 w-[1px] bg-tertiary/10 border-none"/>
                                <div className="flex flex-col gap-1">
                                    <h5>Subject</h5>
                                    <p>{tutorInfo.subject}</p>
                                </div>
                                <hr className="h-8 w-[1px] bg-tertiary/10 border-none"/>
                                <div className="flex flex-col gap-1">
                                    <h5>Fee</h5>
                                    <p>{currency}{tutorInfo.fees}/30min</p>
                                </div>
                            </div>
                            <p className="flex gap-2 mb-2 mt-5">
                                <FaLocationDot />
                                <span>{tutorInfo.address?.city}, {tutorInfo.address?.country}</span>
                            </p>
                            <hr className="border-none h-[1px] bg-tertiary/10 mb-4"/>
                            <h4 className="h4">About Me</h4>
                            <p>{tutorInfo.about}</p>

                            {/* Booking Slots */}
                            <div className="mt-8">
                                <h5 className="h5 mb-3">Booking Slots</h5>
                                <p className="text-xs text-gray-500 mb-3">Times are generated by your browser. Server booking rules use {bookingTimeZone}; sessions must be at least one hour ahead and fall between 10:00 AM and 9:00 PM.</p>

                                {/* Days horizontal scroll */}
                                <div className="flex gap-3 overflow-x-scroll pb-12">
                                    {availableSlots.map((slots, index)=>(
                                        <div key={index} onClick={()=>setSelectedDayIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${selectedDayIndex === index ? "bg-secondary" : "border border-gray-200"}`}>
                                            <div className="medium-14">
                                                {slots[0] && dayOfWeek[slots[0].datetime.getDay()]}
                                            </div>
                                            <div className="medium-14">
                                                {slots[0] && slots[0].datetime.getDate()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Time Slot Scroll */}
                                <div className="flex gap-3 overflow-x-scroll mt-4 max-w-[777px]">
                                    {availableSlots[selectedDayIndex]?.map((slot, i)=>(
                                        <div key={i} onClick={()=>setSelectedTime(slot.time)} className={`text-xs font-light flexCenter min-w-20 py-2 rounded-full cursor-pointer ${slot.time === selectedTime 
                                                ? "bg-secondary" 
                                                : "text-gray-400 border border-gray-300"
                                            }`}
                                        >
                                            {slot.time.toLowerCase()}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={bookSession} disabled={!tutorInfo.available || !selectedTime} className="btn-secondary !text-tertiary mt-4 disabled:cursor-not-allowed disabled:opacity-50">
                                    Book a Session
                                </button>
                            </div>
                        </div>
                    </div>

                    {/*=======================Similar Tutors Section=========================*/}
                    <SimilarTutors tutId={tutId} subject={tutorInfo.subject}/>
                </>
            )}
        </div>
    )
}

export default Session
