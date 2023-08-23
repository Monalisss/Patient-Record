import axios from 'axios';

//permite interacțiunea cu API-ul serverului, trimiterea și primirea de date, și gestionarea răspunsurilor 
//printr-un set simplu de metode

export default axios.create({
    baseURL:'http://localhost:3005/api/patient-record'
})