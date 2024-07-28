import { createContext, useContext, useState, useEffect, useRef } from "react";
import { getCurrentUser } from "../lib/appwrite"; 

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

/** Managing Global State using Context **/

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const flashMessage = useRef();

    useEffect(()=>{
        getCurrentUser().then(
            (res) => {
                if(res) {
                    setIsLoggedIn(true);
                    setUser(res);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            }
        ).catch(
            (error) => {
                console.log("GlobalContext: ",error);
            }
        ).finally(
            () => {
                setIsLoading(false);
            }
        )
    },[])

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                isLoading,
                user,
                setUser,
                flashMessage
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider