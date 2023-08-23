const express = require('express');
const router = express.Router();
const db = require('../db/index');

//get patient records
router.get("/api/patient-record", async (req, res) =>{
    try{
    const result = await db.query("SELECT * FROM pacienti");

    res.status(200).json({
        status: "succes",
        result: result.rows.length,
        data:{ 
            pacient:result.rows,
        }, 
    });
    }catch (err)  { 
        console.log(err);
    }  
});

//get a patient
router.get("/api/patient-record/:id_pacient", async (req, res) =>{
    console.log(req.params.id_pacient);
    try{
        const result = await db.query('SELECT * FROM pacienti where id_pacient = $1', [req.params.id_pacient]);
        res.status(200).json({
            status: "succes",
            data: {pacient : result.rows[0],
            },
        });
        }catch(err){
        console.log(err);

    }
});

//create a patient
router.post("/api/patient-record/add", async (req, res) => {
    console.log(req.body);
    try {
        const result = await db.query(
        'INSERT INTO pacienti (nume, prenume, data_nasterii, telefon, email, sex, alergii, medicamente, istoric_medical, categorii_test, test) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [
            req.body.nume,
            req.body.prenume,
            req.body.data_nasterii,
            req.body.telefon,
            req.body.email,
            req.body.sex,
            req.body.alergii,
            req.body.medicamente,
            req.body.istoric_medical,
            req.body.categorii_test,
            req.body.test,
        ]
        );
        res.status(201).json({
        status: "success",
        data: {
            pacient: result.rows[0],
        },
        });
    } catch (err) {
        console.log(err);
    }
    });
//uptade
router.put("/api/patient-record/:id_pacient", async (req, res) => {
    console.log(req.body);
    try{
        const result = await db.query
        ('UPDATE pacienti SET nume =$1, prenume =$2, data_nasterii =$3, telefon =$4, email= $5, sex= $6, alergii= $7, medicamente= $8, istoric_medical= $9 where id_pacient= $10 returning *', 
            [ req.body.nume ,req.body.prenume, req.body.data_nasterii, req.body.telefon,req.body.email ,
                req.body.sex, req.body.alergii, req.body.medicamente, req.body.istoric_medical, req.params.id_pacient ]);

        res.status(200).json({
            data:{
                pacient: result.rows[0],
            },
        });
    }catch(err){
        console.log(err);
    }
});
//delete
router.delete("/api/patient-record/:id_pacient", async (req,res)=>{

    try{
        const result= await db.query('DELETE FROM pacienti where id_pacient = $1', [req.params.id_pacient]);
        res.status(204).json({

        });

    }catch(err){
        console.log(err);

    }
});

module.exports = router;