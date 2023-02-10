import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isLogged, setIsLogged] = useState();

    useEffect(() => {
        const getUserLogged = localStorage.getItem("user_info");
       setTimeout(()=> setIsLogged(!!getUserLogged), 3000)
    },[]);

    if(isLogged === undefined) {
        return <>loading</>
    }

    if(isLogged === false) {
        return <Navigate to="/signin"/>
    }

    return children
}

export default ProtectedRoute