import React, { createContext, useState } from 'react'
import { tutors } from "../assets/data";
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    
    const navigate = useNavigate();
    const [token, setToken] = useState("dummytoken")
    const currency = "$"

    const value = {tutors, navigate, currency, token, setToken}

    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
};

export default AppContextProvider;