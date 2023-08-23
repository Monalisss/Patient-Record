require('dotenv').config();
const express = require ("express");//PENTRU CREAREA APLICATIEI BACKEND 
const morgan = require('morgan');// PENTRU A AFISA INFORMATII DE INREGISTRARE IN CONSOLA
const cors= require("cors");//PENTRU A PERMITE CERERI DIN ALTE DOMENII

const appointmentsRouter = require("./routers/appointments");
const RegLogRouter = require ("./routers/RegLog");
const testRouter = require ("./routers/test");
const patientsRouter = require ("./routers/patients");

const app = express();

app.use(cors());
app.use(express.json()); //ESTE CONFIGURATA SA PRIMEASCA CERERI JSON PRIN ..

app.use(appointmentsRouter); //PENTRU A CREA RUTELE 
app.use(testRouter);
app.use(patientsRouter);
app.use(RegLogRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log (` listening to ${port}`);

}); 
