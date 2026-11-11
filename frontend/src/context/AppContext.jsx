import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):"")
    const currency = "$"
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [tutors, setTutors] = useState([])
    const [tutorsLoading, setTutorsLoading] = useState(false)
    const [tutorsError, setTutorsError] = useState("")
    const [userData, setUserData] = useState(false)

    const getTutorsData = async ()=>{
        setTutorsLoading(true)
        setTutorsError("")
        try {
            const {data} = await axios.get(backendUrl + "/api/tutor/list")
            if(data.success){
                setTutors(data.tutors)
            } else {
                setTutorsError(data.message || "Unable to load tutors")
                toast.error(data.message)
            }
        } catch (error) {
            const message = error.response?.data?.message || "Unable to load tutors"
            setTutorsError(message)
            toast.error(message)
        } finally {
            setTutorsLoading(false)
        }
    }

    const loadUserProfileData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/user/get-profile', {
                headers:{ token },
            })
            if(data.success){
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to load your profile")
        }
    };

    useEffect(()=>{
        getTutorsData()
    }, []);

    useEffect(()=>{
        if(token){
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token]);

    const value = {
        tutors, 
        tutorsLoading,
        tutorsError,
        navigate, 
        currency, 
        token, 
        setToken, 
        backendUrl,
        loadUserProfileData,
        userData,
        setUserData,
        getTutorsData,
    };

    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
};

export default AppContextProvider;
