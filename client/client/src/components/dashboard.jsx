import React, { useEffect, useState} from "react";
//import { PatientsContext } from '../context/PatientsContext';
import Navbar from '../components2/Navbar'
import PatientApi from '../api/PatientApi';

const Dashboard = () => {
    const [name, setName] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [patientCount, setPatientCount] = useState(0);

    useEffect(() => {
        fetchData();
        fetchPatientCount();
    }, []);

    const fetchData = async () => {
        try {
        const response = await PatientApi.get('/appointments');
        setAppointments(response.data);
        } catch (error) {
        console.error(error);
        }
    };

    const fetchPatientCount = async () => {
        try {
        const response = await PatientApi.get('/');
        setPatientCount(response.data.result);
        } catch (error) {
        console.error(error);
        }
    };
    // Calculeaza programările de luna aceasta
    const currentMonthAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointment_date);
        const currentDate = new Date();
        return (
        appointmentDate.getFullYear() === currentDate.getFullYear() &&
        appointmentDate.getMonth() === currentDate.getMonth()
        );
    });
    // Calculeaza programările in functie de zi
    const appointmentsByDay = {};
    appointments.forEach((appointment) => {
        const appointmentDate = new Date(appointment.appointment_date).toLocaleDateString();
        appointmentsByDay[appointmentDate] = (appointmentsByDay[appointmentDate] || 0) + 1;
    });
/////////////////////////////////////////////
    const getProfile = async () => {
    try {
        const res = await fetch("http://localhost:3005/api/patient-record/Auth/dashboard", {
        method: "GET",
        headers: { token: localStorage.token }
        });

        const parseData = await res.json();
        console.log(parseData)
        setName(parseData.username);

    } catch (err) {
        console.error(err.message);
    }
    };

    useEffect(() =>{
        getProfile()
    },[]);

    return (
    <div>
        <Navbar/>
        <div className="dashboard-container">
        <div className="dashboard-content">
            <h2 className="dashboard-heading">Welcome {name}</h2>
            <div className="card-container">
            <div className="card">
                <div className="card-body">
                <h2 className="card-title">Appointments This Month</h2>
                <p className="large-text">{currentMonthAppointments.length}</p>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                <h2 className="card-title">Appointments by Day</h2>
                <div className="appointments-by-day">
                    {Object.entries(appointmentsByDay).map(([date, count]) => (
                    <div key={date}>
                        <span>{date}:</span> {count}
                    </div>
                    ))}
                </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                <h2 className="card-title">Patients This Month</h2>
                <p className="large-text">{patientCount}</p>
                </div>
                
            </div>
            </div>
        </div>
        </div>
        
    </div>

    );
};

export default Dashboard;