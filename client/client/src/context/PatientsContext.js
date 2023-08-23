import React, { useState, createContext, useEffect } from "react";

export const PatientsContext = createContext();
export const PatientsContextProvider = (props) => {
    const [patients, setPatients] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tests, setTests] = useState([]);

    const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
    );

    const addPatient = (pacient) => {
    setPatients([...patients, pacient]);
    };

    const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
    localStorage.setItem("isAuthenticated", boolean);
    };

    const checkAuthenticated = async () => {
    try {
        const res = await fetch("http://localhost:3005/Auth/verify", {
        method: "GET",
        headers: { token: localStorage.token },
        });

        const parseRes = await res.json();
        parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
        console.error(err.message);
    }
    };
    useEffect(() => {
    checkAuthenticated();
    }, []);
    return (
    <PatientsContext.Provider value={{patients,setPatients,addPatient,
        isAuthenticated,setIsAuthenticated,setAuth,checkAuthenticated,categories,
        setTests, tests,setCategories,}}>
        {props.children}
    </PatientsContext.Provider>
    );
};