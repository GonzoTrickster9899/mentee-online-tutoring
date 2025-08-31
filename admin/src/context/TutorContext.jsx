import React, { createContext, useState } from 'react'

export const TutorContext = createContext();

const TutorContextProvider = (props) => {
    
    const [aToken, setAToken] = useState('dummytoken')
    
    const value = {}
  
    return (
        <TutorContext.Provider value={value}>{props.children}</TutorContext.Provider>
    )
}

export default TutorContextProvider
