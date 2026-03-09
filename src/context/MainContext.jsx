import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const MainContext = createContext();


export const MainContextProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState(null)
    
     const mainContextValue = {
        userDetails,
        setUserDetails
     }
    return <MainContext.Provider value={mainContextValue}>{children}</MainContext.Provider>;

}