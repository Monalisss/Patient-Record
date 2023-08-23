import React, { useState, useEffect, useContext } from 'react';
import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PatientsContext } from '../context/PatientsContext';
import PatientApi from '../api/PatientApi';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Report = () => {
  const { categories, setCategories, tests, setTests, patients, setPatients } = useContext(PatientsContext);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await PatientApi.get('/');
        const patientsData = response.data;
        setPatients(patientsData); // Set the patients state
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await PatientApi.get('/categories');
        const categoriesData = response.data.data.categories;
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTests = async () => {
      try {
        const response = await PatientApi.get('/tests');
        const testsData = response.data.data.tests;
        setTests(testsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPatients();
    fetchCategories();
    fetchTests();
  }, []);

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
    setSelectedValue('');
  };

  const handleValueChange = (e) => {
    setSelectedValue(e.target.value);
  };

  useEffect(() => {
    if (selectedFilter === 'age') {
      const age = parseInt(selectedValue);
      setFilteredPatients(
        patients.filter(
          (patient) =>
            new Date().getFullYear() -
              new Date(patient.data_nasterii).getFullYear() ===
            age
        )
      );
    } else if (selectedFilter === 'test') {
      setFilteredPatients(
        patients.filter((patient) => patient.test === selectedValue)
      );
    } else if (selectedFilter === 'category') {
      setFilteredPatients(
        patients.filter((patient) =>
          patient.categorii_test.includes(parseInt(selectedValue))
        )
      );
    } else {
      setFilteredPatients(patients);
    }
  }, [patients, selectedFilter, selectedValue]);

  const generateReport = () => {
    if (filteredPatients.length === 0) {
      alert('No patients found for the selected filter.');
      return;
    }

    const docDefinition = {
      content: [
        { text: 'Patient Report', style: 'header' },
        { text: 'Filtered Patients:', style: 'subheader' },
        {
          ul: filteredPatients.map((patient) => `${patient.nume} ${patient.prenume}`),
        },
        { text: 'Patient Details:', style: 'subheader' },
        {
          table: {
            body: [
              [
                { text: 'ID', style: 'tableHeader' },
                { text: 'Name', style: 'tableHeader' },
                { text: 'Date of Birth', style: 'tableHeader' },
                { text: 'Phone', style: 'tableHeader' },
                { text: 'Email', style: 'tableHeader' },
                { text: 'Test', style: 'tableHeader' },
                { text: 'Category', style: 'tableHeader' },
              ],
              ...filteredPatients.map((patient) => [
                patient.id_pacient,
                `${patient.nume} ${patient.prenume}`,
                new Date(patient.data_nasterii).toLocaleDateString('en-GB'),
                patient.telefon,
                patient.email,
                getTestName(patient.test),
                getCategoryName(patient.category),
              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableHeader: {
          bold: true,
        },
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.download('patient_report.pdf');
  };

  const getTestName = (testId) => {
    const test = tests.find((test) => test.test_id === testId);
    return test ? test.nume_test : '';
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (category) => category.id_categorie === categoryId
    );
    return category ? category.nume_categorie : '';
  };

  return (
    <div>
      <h3>Generate Report</h3>
      <div className="form-group">
        <label>
          <input
            type="radio"
            name="filter"
            value=""
            checked={selectedFilter === ''}
            onChange={handleFilterChange}
          />{' '}
          All Patients
        </label>
        <label>
          <input
            type="radio"
            name="filter"
            value="age"
            checked={selectedFilter === 'age'}
            onChange={handleFilterChange}
          />{' '}
          Age
        </label>
        <label>
          <input
            type="radio"
            name="filter"
            value="test"
            checked={selectedFilter === 'test'}
            onChange={handleFilterChange}
          />{' '}
          Test
        </label>
        <label>
          <input
            type="radio"
            name="filter"
            value="category"
            checked={selectedFilter === 'category'}
            onChange={handleFilterChange}
          />{' '}
          Category
        </label>
      </div>
      {selectedFilter === 'age' && (
        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            value={selectedValue}
            onChange={handleValueChange}
          />
        </div>
      )}
      {selectedFilter === 'test' && (
        <div className="form-group">
          <label>Test:</label>
          <select value={selectedValue} onChange={handleValueChange}>
            <option value="">Select Test</option>
            {tests.map((test) => (
              <option key={test.test_id} value={test.test_id}>
                {test.nume_test}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedFilter === 'category' && (
        <div className="form-group">
          <label>Category:</label>
          <select value={selectedValue} onChange={handleValueChange}>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id_categorie} value={category.id_categorie}>
                {category.nume_categorie}
              </option>
            ))}
          </select>
        </div>
      )}
      <button onClick={generateReport}>Generate Report</button>
    </div>
  );
};

export default Report;