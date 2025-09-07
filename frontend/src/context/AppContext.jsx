import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    
    const navigate = useNavigate();
    const [token, setToken] = useState("dummytoken")
    const currency = "$"
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [tutors, setTutors] = useState([])

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

    useEffect(()=>{
        getTutorsData()
    }, [])

    const value = {tutors, navigate, currency, token, setToken, backendUrl}

    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
};

export default AppContextProvider;