import React, { useState, useEffect } from 'react';
import PatientApi from '../api/PatientApi';
import Navbar from '../components2/Navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  // declaram mai multe stări folosind hook-ul useState pentru a gestiona diferite informații
  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointmentsByDate();
  }, [searchDate, appointments]);

  useEffect(() => {
    filterUpcomingAppointments();
  }, [appointments]);

  const fetchAppointments = async () => {
    try {
      const response = await PatientApi.get('/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addAppointment = async () => {
    try {
      const currentDate = new Date();
      if (date < currentDate) {
        alert("Please select a future date for the appointment.");
        return;
      }

      const nameRegex = /^[A-Za-z]+$/;
      if (!name.match(nameRegex)) {
        alert('Please enter a valid name (only letters are allowed).');
        return;
      }

      if (!lastName.match(nameRegex)) {
        alert('Please enter a valid last name (only letters are allowed).');
        return;
      }

      const response = await PatientApi.post('/appointments', {
        name,
        last_name: lastName,
        appointment_date: date.toISOString().split('T')[0],
        appointment_time: time,
      });

      setAppointments([...appointments, response.data]);
      setName('');
      setLastName('');
      setDate(new Date());
      setTime('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await PatientApi.delete(`/appointments/${id}`);
      setAppointments(appointments.filter((appointment) => appointment.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const updateAppointment = async (id, updatedData) => {
    try {
      const response = await PatientApi.put(`/appointments/${id}`, updatedData);
      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === id ? response.data : appointment
      );
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error(error);
    }
  };

  const filterAppointmentsByDate = () => {
    if (searchDate === '') {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointment_date);
        const searchDateObj = new Date(searchDate);
        const isYearMatch = searchDateObj.getFullYear() === appointmentDate.getFullYear();
        const isMonthMatch = searchDateObj.getMonth() === appointmentDate.getMonth();
        const isDayMatch = searchDateObj.getDate() === appointmentDate.getDate();

        if (isYearMatch && !isMonthMatch && !isDayMatch) {
          return true; // filtreaza numai după an
        }

        if (isYearMatch && isMonthMatch && !isDayMatch) {
          return true; // filtreaza numai după an si luna
        }

        if (isYearMatch && isMonthMatch && isDayMatch) {
          return true; // filtreaza numai după an, luna si zi
        }

        return false;
      });

      setFilteredAppointments(filtered);
    }
  };

  const filterUpcomingAppointments = () => {
    const currentDate = new Date();
    const upcoming = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date);
      return appointmentDate >= currentDate;
    });
    setUpcomingAppointments(upcoming);
  };

  const rescheduleAppointment = async (id) => {
    try {
      const appointment = appointments.find((appointment) => appointment.id === id);
      const updatedDate = prompt('Enter updated date (YYYY-MM-DD):', new Date(appointment.appointment_date).toLocaleDateString());
      const updatedTime = prompt('Enter updated time:', appointment.appointment_time);

      if (updatedDate && updatedTime) {
        const updatedData = {
          appointment_date: updatedDate,
          appointment_time: updatedTime,
        };
        await updateAppointment(id, updatedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-20">
            <h2>Add Appointment</h2>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                pattern="[A-Za-z]+"
                title="Please enter a valid name (only letters are allowed)."
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                pattern="[A-Za-z]+"
                title="Please enter a valid last name (only letters are allowed)."
                required
              />
            </div>
            <div className="row">
              <div className="col">
                <DatePicker
                  className="form-control"
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Date (YYYY-MM-DD)"
                  minDate={new Date()}
                />
              </div>
              <div className="col">
                <input
                  type="time"
                  className="form-control"
                  placeholder="Time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div className="col">
                <button className="btn btn-primary" onClick={addAppointment}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <br />
        <br />
        <br />
        <div className="mt-4">
          <h3>Upcoming Appointments</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Last Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {upcomingAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.name}</td>
                  <td>{appointment.last_name}</td>
                  <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                  <td>{appointment.appointment_time}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => rescheduleAppointment(appointment.id)}
                    >
                      Reschedule
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <br />
        <br />

        <div className="col-md-20">
          <h2>Search Appointments by Date</h2>
          <div className="row">
            <div className="col">
              <DatePicker
                className="form-control"
                selected={searchDate}
                onChange={(date) => setSearchDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Search Date (YYYY-MM-DD)"
              />
            </div>
            <div className="col">
              <button className="btn btn-primary" onClick={filterAppointmentsByDate}>
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3>All Appointments</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Last Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.name}</td>
                  <td>{appointment.last_name}</td>
                  <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                  <td>{appointment.appointment_time}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteAppointment(appointment.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const updatedDate = prompt(
                          'Enter updated date (YYYY-MM-DD):',
                          appointment.appointment_date
                        );
                        const updatedTime = prompt(
                          'Enter updated time:',
                          appointment.appointment_time
                        );
                        if (updatedDate && updatedTime) {
                          const updatedData = {
                            appointment_date: updatedDate,
                            appointment_time: updatedTime,
                          };
                          updateAppointment(appointment.id, updatedData);
                        }
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;