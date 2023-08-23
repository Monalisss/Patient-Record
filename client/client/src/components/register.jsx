import React, { Fragment, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { PatientsContext } from '../context/PatientsContext';
import '../components2/reg.css' ;

const Register = () => {
    const {setAuth} = useContext(PatientsContext);
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: ""
        });
        const { email, password, name } = inputs;
    
    const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { email, password, name };
            const response = await fetch(
                "http://localhost:3005/api/patient-record/Auth/Register",
            {
                method: "POST",
                headers: {
                "Content-type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();
            if(parseRes.token){ 

                localStorage.setItem("token", parseRes.token);
                setAuth(true);
                toast.success("Register Successfully");
        }else{
            setAuth(false);
            toast.error(parseRes);
        }
    
        } catch (err) {
            console.error(err.message);
        }
        };

    return (
        <div className="register-container">
        <Fragment>
            <h1 className="register-title mt-5">Register</h1>
            <form onSubmit={onSubmitForm}>
            <input
                type="text"
                name="email"
                value={email}
                placeholder="email"
                onChange={e => onChange(e)}
                className="register-input form-control my-3"
            />
            <input
                type="password"
                name="password"
                value={password}
                placeholder="password"
                onChange={e => onChange(e)}
                className="register-input form-control my-3"
            />
            <input
                type="text"
                name="name"
                value={name}
                placeholder="name"
                onChange={e => onChange(e)}
                className="register-input form-control my-3"
            />
            <button className="register-submit-btn btn btn-success btn-block">
                Submit
            </button>
            </form>
    
            <h1> </h1>
    
            <Link to="/login" className="register-login-link">
            Login
            </Link>
        </Fragment>
        </div>
    )
};

export default Register;