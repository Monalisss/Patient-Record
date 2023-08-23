import React, { Fragment, useState, useContext } from "react";
import { Link} from "react-router-dom";
import { PatientsContext } from '../context/PatientsContext';
import { toast } from "react-toastify";
import '../components2/login.css'

const Login = () => {
    const {setAuth} = useContext(PatientsContext);
    const [inputs, setInputs] = useState({
    email: "",
    password: ""
    });

    const { email, password } = inputs;

    const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

    const onSubmitForm = async e => {
    e.preventDefault();
    try {
        const body = { email, password };
        const response = await fetch(
        "http://localhost:3005/api/patient-record/Auth/login",
        {
            method: "POST",
            headers: {
            "Content-type": "application/json"
            },
            body: JSON.stringify(body)
        }
        );
        const parseRes = await response.json();
        if(parseRes.token) {
            localStorage.setItem("token", parseRes.token);

            setAuth(true);
            toast.success("Logged in Successfully");

        }else {
            setAuth(false);
            toast.error(parseRes);
        }
        
    } catch (err) {
        console.error(err.message);
    }
    };

    return (
        <Fragment>
        <div className="login-container">
          <h1 className="login-title mt-5 text-center">Login</h1>
          <form onSubmit={onSubmitForm}>
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              className="login-input form-control my-3"
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => onChange(e)}
              className="login-input form-control my-3"
            />
            <button className="login-submit-btn btn btn-success btn-block">Submit</button>
          </form>
          <Link to="/register" className="login-register-link">
            Register
          </Link>
        </div>
      </Fragment>
    );
};

export default Login;