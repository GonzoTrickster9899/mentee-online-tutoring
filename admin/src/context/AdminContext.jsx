import React, { createContext, useContext, useState } from 'react'
import axios from "axios"
import { AppContext } from './AppContext';
import { toast } from "react-toastify"

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    
    const [aToken, setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):"")
    const {backendUrl} = useContext(AppContext)

    const [tutors, setTutors] = useState([])
    const [sessions, setSessions] = useState([])
    const [dashData, setDashData] = useState(false)

    
    const getAllTutors = async ()=>{
        try {
            const {data} = await axios.post(backendUrl + "/api/admin/all-tutors", {}, {headers:{aToken}})
            if(data.success){
                setTutors(data.tutors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to load tutors")
        }
    }

    const changeAvailability = async (tutId)=>{
        try {
            const {data} = await axios.post(backendUrl + "/api/admin/change-availability", {tutId}, {headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllTutors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update availability")
        }
    }


    const getAllSessions = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/sessions', {headers: {aToken}})
            if(data.success){
                setSessions(data.sessions)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to load sessions")

        }
    }
    
    const cancelSession = async (sessionId)=>{
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/cancel-session', {sessionId}, {headers: {aToken}})

            if(data.success){
                toast.success(data.message)
                getAllSessions()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to cancel this session")

        }
    }


    const getDashData = async ()=>{
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/dashboard', {}, {headers: {aToken}})

            if(data.success){
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to load dashboard data")
        }
    }

    const value = { aToken, setAToken, getAllTutors, tutors, changeAvailability, getAllSessions, sessions, setSessions, getDashData, dashData, cancelSession}

    return (
        <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>
    )
}

export default AdminContextProvider
