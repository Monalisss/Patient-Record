import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './form.css';
import PatientApi from '../api/PatientApi';
import { PatientsContext } from '../context/PatientsContext';
import Navbar from '../components2/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const Add = () => {
  const { addPatient, categories, setCategories, tests, setTests } = useContext(PatientsContext);
  const navigate = useNavigate();

  const [nume, setNume] = useState('');
  const [prenume, setPrenume] = useState('');
  const [telefon, setTelefon] = useState('');
  const [data_nasterii, setData] = useState('');
  const [email, setEmail] = useState('');
  const [sex, setSex] = useState('F');
  const [alergii, setAlergii] = useState('');
  const [medicamente, setMedicamente] = useState('');
  const [istoric, setIstoric] = useState('');
  const [categorii_test, setCategoriiTest] = useState('');
  const [test, setTest] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);



  const fetchCategories = async () => {
    try {
      const response = await PatientApi.get('/categories');
      const categoriesData = response.data.data.categories;
      setCategories(categoriesData);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTestsByCategory = async (categoryId) => {
    try {
      const response = await PatientApi.get(`/tests/${categoryId}`);
      const testsData = response.data.data.tests;
      setTests(testsData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[A-Za-z]+$/.test(nume) || !/^[A-Za-z]+$/.test(prenume)) {
      toast.error('Numele și prenumele trebuie să conțină doar litere.');
      return;
    }

    try {
      const response = await PatientApi.post('/add', {
        nume,
        prenume,
        telefon,
        data_nasterii,
        email,
        sex,
        alergii,
        medicamente,
        istoric_medical: istoric,
        categorii_test,
        test,
      });
      addPatient(response.data.data.pacient);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div>
      <Navbar />
      <div className="container">
        <form className="form">
          <h3>Formular</h3>

          <div className="form-group">
            <label htmlFor="name">Nume:</label>
            <input
              value={nume}
              onChange={(e) => setNume(e.target.value)}
              type="text"
              id="name"
              name="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Prenume">Prenume:</label>
            <input
              value={prenume}
              onChange={(e) => setPrenume(e.target.value)}
              type="text"
              id="Prenume"
              name="Prenume"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Telefon">Telefon:</label>
            <input
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              type="number"
              id="Telefon"
              name="Telefon"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Data_Nasterii">Data_Nasterii:</label>
            <input
              value={data_nasterii}
              onChange={(e) => setData(e.target.value)}
              type="date"
              id="Data_Nasterii"
              name="Data_Nasterii"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Sex">Sex:</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              required
            >
              <option value="F">F</option>
              <option value="M">M</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="Alergii">Alergii:</label>
            <textarea
              value={alergii}
              onChange={(e) => setAlergii(e.target.value)}
              id="Alergii"
              name="Alergii"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="Medicamente">Medicamente:</label>
            <textarea
              value={medicamente}
              onChange={(e) => setMedicamente(e.target.value)}
              id="Medicamente"
              name="Medicamente"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="Istoric_Medical">Istoric_Medical:</label>
            <textarea
              value={istoric}
              onChange={(e) => setIstoric(e.target.value)}
              id="Istoric_Medical"
              name="Istoric_Medical"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="category">Categorie:</label>
            <select
              id="category"
              name="category"
              required
              onChange={(e) => {
                setCategoriiTest(e.target.value);
                fetchTestsByCategory(e.target.value);
              }}
            >
              <option value="">Selectează categorie</option>
              {categories.map((category) => (
                <option
                  key={category.id_categorie}
                  value={category.id_categorie}
                >
                  {category.nume_categorie}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="test">Test:</label>
            <select
              id="test"
              name="test"
              required
              disabled={tests.length === 0}
              onChange={(e) => setTest(e.target.value)}
            >
              <option value="">Selectează test</option>
              {tests.map((test) => (
                <option key={test.test_id} value={test.test_id}>
                  {test.nume_test}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleSubmit} type="submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;