import React, { createContext, useState, useContext } from 'react'
import axios from "axios"
import {toast} from "react-toastify"
import { AppContext } from './AppContext';

export const TutorContext = createContext();

const TutorContextProvider = (props) => {
    
    const [tToken, setTToken] = useState(localStorage.getItem('tToken')?localStorage.getItem('tToken'):"")
    const {backendUrl} = useContext(AppContext)
    const [sessions, setSessions] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    const getSessions = async()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/tutor/sessions', {headers: {tToken}})

            if(data.success){
                setSessions(data.sessions)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to load sessions")
        }
    }


    const completeSession = async (sessionId)=>{
        try {
            const {data} = await axios.post(backendUrl + '/api/tutor/complete-session', {sessionId}, {headers: {tToken}})
            if(data.success){
                toast.success(data.message)
                getSessions()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update the session")

        }
    }


    const cancelSession = async (sessionId)=>{
        try {
            const {data} = await axios.post(backendUrl + '/api/tutor/cancel-session', {sessionId}, {headers: {tToken}})
            if(data.success){
                toast.success(data.message)
                getSessions()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update the session")

        }
    }


    const getDashData = async()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/tutor/dashboard', {headers:{ttoken:tToken}})
            if(data.success){
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to load dashboard data")

        }
    }

    const getProfileData = async ()=> {
        try {
            const {data} = await axios.get(backendUrl + '/api/tutor/profile', {headers:{tToken}})
            if(data.success){
                setProfileData(data.profileData)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to load your profile")
            
        }
    }
    
        const value = {tToken, setTToken, sessions, setSessions, getSessions, completeSession, cancelSession, dashData, getDashData, setProfileData, profileData, getProfileData}
  
    return (
        <TutorContext.Provider value={value}>{props.children}</TutorContext.Provider>
    )
}

export default TutorContextProvider
