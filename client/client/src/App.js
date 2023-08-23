import React from 'react'
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Home from "./components/Home"
import Update from './components/Update'

import Add from './components/Add';
import './app.css'
import Appointments from './components/appointments';
import Dash from './components/Dash'

import { PatientsContextProvider } from './context/PatientsContext';
import { PatientsContext } from './context/PatientsContext';

import Dashboard from './components/dashboard';
import Register from './components/register';
import Login from './components/login';

import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

toast.configure();

//Aceste rutări se bazează pe contextul PatientsContext, care 
//furnizează informații despre pacienți și autentificare către componente. Autentificarea este 
//gestionată prin intermediul variabilei isAuthenticated și metodei setAuth, care actualizează 
//starea autentificării în funcție de informațiile stocate în localStorage. 
//În plus, se definește și  se utilizează PatientsContextProvider, care încapsulează întreaga aplicație și asigură 
//furnizarea contextului PatientsContext către componentele copil.
const App = () => {
  return (
    <PatientsContextProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/patient/appointments" element={<PatientsContext.Consumer>
                  {(context) =>
                    context.isAuthenticated ? <Appointments/> : <Navigate to="/login" />
                  }
                </PatientsContext.Consumer>} />

            <Route path="/" element={<PatientsContext.Consumer>
                  {(context) =>
                    context.isAuthenticated ? <Home /> : <Navigate to="/login" />
                  }
                </PatientsContext.Consumer>} />

            <Route path="/patient/dash" element={<PatientsContext.Consumer>
                  {(context) =>
                    context.isAuthenticated ? <Dash /> : <Navigate to="/login" />
                  }
                </PatientsContext.Consumer>} />

            <Route path="/patient/:id_pacient/update" element={<PatientsContext.Consumer>
                  {(context) =>
                    context.isAuthenticated ? <Update /> : <Navigate to="/login" />
                  }
                </PatientsContext.Consumer>} />

            <Route path="/add" element={<PatientsContext.Consumer>
                  {(context) =>
                    context.isAuthenticated ? <Add /> : <Navigate to="/login" />
                  }
                </PatientsContext.Consumer>} />

            <Route
              exact
              path="/login"
              element={
                <PatientsContext.Consumer>
                  {(context) =>
                    !context.isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
                  }
                </PatientsContext.Consumer>
              }
            />

            <Route
              exact
              path="/register"
              element={
                <PatientsContext.Consumer>
                  {(context) =>
                    !context.isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
                  }
                </PatientsContext.Consumer>
              }
            />

            <Route
              exact
              path="/dashboard"
              element={
                <PatientsContext.Consumer>
                  {(context) =>
                    context.isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
                  }
                </PatientsContext.Consumer>
              }
            />
          </Routes>
        </Router>
      </div>
    </PatientsContextProvider>
  );
};
export default App;