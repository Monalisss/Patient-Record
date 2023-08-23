import React, { useState, useEffect } from 'react';
import Navbar from '../components2/Navbar'
import PatientApi from '../api/PatientApi';
import './dash.css'


const Dash = () => {
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

    // Calculate appointments this month
    const currentMonthAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointment_date);
        const currentDate = new Date();
        return (
        appointmentDate.getFullYear() === currentDate.getFullYear() &&
        appointmentDate.getMonth() === currentDate.getMonth()
        );
    });

    // Calculate appointments by day
    const appointmentsByDay = {};
    appointments.forEach((appointment) => {
        const appointmentDate = new Date(appointment.appointment_date).toLocaleDateString();
        appointmentsByDay[appointmentDate] = (appointmentsByDay[appointmentDate] || 0) + 1;
    });

    return (
        <div>
            <Navbar />
        <div className="dashboard-container">
        <div className="dashboard-content">
            <h1 className="dashboard-heading">Dashboard</h1>
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

export default Dash;