import React, { useContext } from 'react';
import { PatientsContext } from '../context/PatientsContext';
import './Comp2.css';

const Report2 = ({ patientId }) => {
    const { patients, categories, tests } = useContext(PatientsContext);

    const patient = patients.find((patient) => patient.id_pacient === patientId);

    const getTestCategoryName = (categoryId) => {
    return categories[categoryId] || '';
    };

    const getTestName = (testId) => {
    return tests[testId] || '';
    };

    const handleDownloadReport = () => {
    const reportContent = `Patient Name: ${patient.nume} ${patient.prenume}\n` +
        `Date of Birth: ${new Date(patient.data_nasterii).toLocaleDateString('en-GB')}\n` +
        `Phone: ${patient.telefon}\n` +
        `Email: ${patient.email}\n` +
        `Sex: ${patient.sex}\n` +
        `Allergies: ${patient.alergii}\n` +
        `Medications: ${patient.medicamente}\n` +
        `Medical History: ${patient.istoric_medical}\n` +
        `Test Category: ${getTestCategoryName(patient.categorii_test)}\n` +
        `Test: ${getTestName(patient.test)}\n`;

    const element = document.createElement('a');
    const file = new Blob([reportContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Patient_${patient.id_pacient}_Report.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    };

    if (!patient) {
    return null; // Patient not found
    }

    return (
    <div>
        <button className="report-button" onClick={handleDownloadReport}>Download Report</button>
    </div>
    );
};

export default Report2;