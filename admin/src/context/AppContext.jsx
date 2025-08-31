import React, { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

const AppContextProvider = (props) =>{
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const navigate = useNavigate()
    const value = {navigate, backendUrl}

    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    )
}

export default AppContextProvider