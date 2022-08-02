import { createContext, useEffect, useState } from "react";
import { setJWT } from "../Lib/apiClient";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [auth, setAuth] = useState({ ...user });

    useEffect(() => {

        if(auth.accessToken){
            setJWT(auth.accessToken);
        }
    }, [auth]);
    

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;