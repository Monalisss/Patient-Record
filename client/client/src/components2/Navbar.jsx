import React, { useContext } from "react";
import { toast } from "react-toastify";
import { PatientsContext } from '../context/PatientsContext';

const Navbar = () => {
    const {setAuth} = useContext(PatientsContext);
    const logout = async e => {
        e.preventDefault();
        try {
            localStorage.removeItem("token");
            setAuth(false);
            toast.success("Logout successfully");
        } catch (err) {
            console.error(err.message);
        }
        };
    return (
        <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <a className="navbar-brand" href="/dashboard">Dashboard</a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" 
    data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
        <li className="nav-item active">
            <a className="nav-link" href={"/add"}>Add Patient <span class="sr-only">(current)</span></a>
        </li>
        <li className="nav-item">
            <a className="nav-link" href={"/"}>Patient Record</a>
        </li>
        <li className="nav-item">
            <a className="nav-link" href={"/patient/appointments"}>Appointments</a>
        </li>
        </ul>
        <button onClick={e => logout(e)} className="btn btn-primary">
        Logout
        </button>
        
    </div>
    </nav>
    </div>
    )
}
export default Navbar
