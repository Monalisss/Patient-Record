import React, { useEffect, useState, useContext } from 'react';
import './Comp2.css';
import PatientApi from '../api/PatientApi';
import { PatientsContext } from '../context/PatientsContext';
import { useNavigate } from 'react-router-dom';
import Report2 from './PatientReport';

const ListaPacienti = () => {
  const { patients, setPatients, categories, setCategories, tests, setTests } = useContext(PatientsContext);
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState('');
  const [searchTest, setSearchTest] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PatientApi.get('/');
        setPatients(response.data.data.pacient);
        fetchCategories();

        // Fetch tests for each patient
        response.data.data.pacient.forEach((patient) => {
          fetchTests(patient.categorii_test);
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await PatientApi.get('/categories');
      const categoriesData = response.data.data.categories;
      const categoriesMap = {};
      categoriesData.forEach((category) => {
        categoriesMap[category.id_categorie] = category.nume_categorie;
      });
      setCategories(categoriesMap);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTests = async (categoryId) => {
    try {
      const response = await PatientApi.get(`/tests/${categoryId}`);
      const testsData = response.data.data.tests;
      const testsMap = {};
      testsData.forEach((test) => {
        testsMap[test.test_id] = test.nume_test;
      });
      setTests(testsMap);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id_pacient) => {
    try {
      await PatientApi.delete(`/${id_pacient}`);
      setPatients((prevPatients) =>
        prevPatients.filter((patient) => patient.id_pacient !== id_pacient)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = (id_pacient) => {
    navigate(`/patient/${id_pacient}/update`);
  };

  const getTestCategoryName = (categoryId) => {
    return categories[categoryId] || '';
  };

  const getTestName = (testId) => {
    return tests[testId] || '';
  };

  // Filter patients based on search criteria
  const filteredPatients = patients.filter((patient) => {
    const patientName = `${patient.nume} ${patient.prenume}`.toLowerCase();
    const testName = getTestName(patient.test).toLowerCase();

    return (
      patientName.includes(searchName.toLowerCase()) &&
      testName.includes(searchTest.toLowerCase())
    );
  });

  return (
<div className='patients-table-container'>
  <div className="search-container">
    <input
      type="text"
      placeholder="Search by name"
      value={searchName}
      onChange={(e) => setSearchName(e.target.value)}
      className="search-input"
    />
    <input
      type="text"
      placeholder="Search by test"
      value={searchTest}
      onChange={(e) => setSearchTest(e.target.value)}
      className="search-input"
    />
  </div>
      <table className='table table-hover table-dark'>
        <thead>
          <tr className='bg-primary'>
            <th scope='col'>Id_Pacient</th>
            <th scope='col'>Nume</th>
            <th scope='col'>Prenume</th>
            <th scope='col'>Data_Nasterii</th>
            <th scope='col'>Telefon</th>
            <th scope='col'>Email</th>
            <th scope='col'>Sex</th>
            <th scope='col'>Alergii</th>
            <th scope='col'>Medicamente</th>
            <th scope='col'>Istoric_Medical</th>
            <th scope='col'>Categorii_Test</th>
            <th scope='col'>Test</th>
            <th scope='col'>Update</th>
            <th scope='col'>Delete</th>
            <th scope='col'>Raport</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient.id_pacient}>
              <th scope='row'>{patient.id_pacient}</th>
              <td>{patient.nume}</td>
              <td>{patient.prenume}</td>
              <td>
                {new Date(patient.data_nasterii).toLocaleDateString('en-GB')}
              </td>
              <td>{patient.telefon}</td>
              <td>{patient.email}</td>
              <td>{patient.sex}</td>
              <td>{patient.alergii}</td>
              <td>{patient.medicamente}</td>
              <td>{patient.istoric_medical}</td>
              <td>{getTestCategoryName(patient.categorii_test)}</td>
              <td>{getTestName(patient.test)}</td>
              <td>
                <button
                  onClick={() => handleUpdate(patient.id_pacient)}
                  className='btn btn-warning'
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleDelete(patient.id_pacient)}
                  className='btn btn-danger'
                >
                  Delete
                </button>
              </td>
              <td>
                <Report2 patientId={patient.id_pacient} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaPacienti;
