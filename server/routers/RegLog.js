const express = require('express');
const router = express.Router();
const db = require('../db/index');
const jwtGenerator = require ("../utils/jwtGenerator");//MODULUL PENTRU GENERAREA SI VERIFICAREA TOEKNURILOR JSON WEB 
const auth = require("../middleware/auth"); //PT AUTENITIFICARE
const bcrypt = require("bcrypt");//BIBLOTECA PENTRU CRIPTARE 


//PENTRU VALIDAREA DATELOR PRIMITE DIN CERERE, VERIFICA IN DB DACA EXISTA DACA EXISTA UN UTILIZATOR CU ADRESA MAIL
const valid = (req, res, next) => {
    const { email, name, password } = req.body;

    function validEmail(user_email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user_email);
    }

    if (req.path === "/api/patient-record/Auth/Register") {
        console.log(!email.length);
        if (![email, name, password].every(Boolean)) {
        return res.status(401).json("Missing Credentials");

        } else if (!validEmail(email)) {
        return res.status(401).json("Invalid Email");
        }

    } else if (req.path === "/api/patient-record/Auth/login") {
        if (![email, password].every(Boolean)) {
        return res.status(401).json("Missing Credentials");


        } else if (!validEmail(email)) {
        return res.status(401).json("Invalid Email");
        }
    }
    next();
    };

    //PAROLA ESTE CRYPTATA FOLOSIND BCRYPT.HASH
    //SE GENEREAZA UN TOKEN CU JWTGENERATOR SI SE TRIMITE RASP IN HTTP
  /////////////////////////////////////////////////////////////////////////////////
    router.post("/api/patient-record/Auth/Register", valid , async (req, res) =>{
    try{
        const{ name, email, password} = req.body;

        const user = await db.query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]);
        
        if (user.rows.length !== 0){
            return res.status(401).json("user already exist")
        }
        ///////////////////
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        
        const bcryptPassword= await bcrypt.hash(password, salt);
        //////////////

        const newUser= await db.query("INSERT INTO users (username ,user_email, user_password) VALUES ($1 , $2, $3) returning *" , [
            name , email, bcryptPassword
        ]);

        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({token});

    }catch(err){
        console.log(err);
        res.status(201).send("server Error")
    }
});

//PAROLA FURNIZATA ESTE COMPARTATA CU PAROLA TOCATA IN DB FOLOSIND BCRYPT COMPARE , DACA ESTE VALIDA SE GENEREAZA UN TOEKN
  //Login route

    router.post("/api/patient-record/Auth/login", valid , async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await db.query("SELECT * FROM users WHERE user_email = $1", [
        email
        ]);

        if (user.rows.length === 0) {
        return res.status(401).json("Parola sau Email Invalid");
        }
        const validPassword = await bcrypt.compare(
        password,
        user.rows[0].user_password
        );
        
        if (!validPassword) {
            return res.status(401).json("Parola sau Email Invalid");
            }
    
            const token = jwtGenerator(user.rows[0].user_id);
            return res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
    });
  /////////////////////////////////////
  //UTILIZEAZA HTTP GET PENTRU A VERIFICA DACA UTILIZATORUL ESTE AUTENTIFICAT , FOLOSESTE AUTH PENTRU A VERIFICA DACA AUTENTICITATEA
  //TOKENULUI 

    router.get("/api/patient-record/Auth/verify", auth , async (req, res) => {
    try {
        res.json(true);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
    });

    router.get("/api/patient-record/Auth/dashboard", auth, async (req, res) => {
        try {

            const user = await db.query("SELECT username FROM users WHERE user_id = $1" , [req.user]);
            return res.json(user.rows[0]);
    
    
            //res.json(req.user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
        });

module.exports = router;