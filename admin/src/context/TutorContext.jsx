import React, { createContext, useState } from 'react'

export const TutorContext = createContext();

const TutorContextProvider = (props) => {
    
    const [tToken, setTToken] = useState(localStorage.getItem('tToken')?localStorage.getItem('tToken'):"")
    
    const value = {tToken, setTToken}
  
    return (
        <TutorContext.Provider value={value}>{props.children}</TutorContext.Provider>
    )
}

export default TutorContextProvider
