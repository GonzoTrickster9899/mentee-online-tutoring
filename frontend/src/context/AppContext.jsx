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
    const [userData, setUserData] = useState(false)

    const getTutorsData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + "/api/tutor/list")
            if(data.success){
                // console.log(data.tutors)
                setTutors(data.tutors)
                
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)            
        }
    }

    const loadUserProfileData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/user/get-profile', {headers:{token}})
            if(data.success){
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getTutorsData()
    }, [])

    useEffect(()=>{
        if(token){
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])

    const value = {
        tutors, 
        navigate, 
        currency, 
        token, 
        setToken, 
        backendUrl,
        loadUserProfileData,
        userData,
        setUserData,
    };

    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
};

export default AppContextProvider;