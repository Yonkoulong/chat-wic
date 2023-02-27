import React, { useEffect, useState } from 'react';
import { Navigate, redirect } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {

    const [isLogged, setIsLogged] = useState();

    useEffect(() => {
        const getUserLogged = localStorage.getItem("token");
       setTimeout(()=> setIsLogged(!!getUserLogged), 500)
    },[]);

    if(isLogged === undefined) {
        return <>loading</>
    }

    if(isLogged === false) {
        return <Navigate to="/signin"/>
    }

    return children;
}

export default ProtectedRoute;