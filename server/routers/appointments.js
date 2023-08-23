const express = require('express');
const router = express.Router();
const db = require('../db/index');

// Toate programarile
router.get('/api/patient-record/appointments', async (req, res) => {
    try {
    const result = await db.query('SELECT * FROM appointments ORDER BY appointment_date');
    res.json(result.rows);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
    }
});

// Programarile dupa data
router.get('/api/patient-record/appointments/:date', async (req, res) => {
    const { date } = req.params;
    try {
    const result = await db.query('SELECT * FROM appointments WHERE appointment_date = $1', [date]);
    res.json(result.rows);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/api/patient-record/appointments', async (req, res) => {
    try {
    const result = await db.query(
      'INSERT INTO appointments (name, last_name, appointment_date, appointment_time) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.body.name, req.body.last_name, req.body.appointment_date, req.body.appointment_time]
    );
    res.status(201).json({
        status: "succes",
        data:{
            appointment:result.rows[0],
        },
    });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/api/patient-record/appointments/:id', async (req, res) => {
    const { id } = req.params;
    try {
    await db.query('DELETE FROM appointments WHERE id = $1', [id]);
    res.sendStatus(204);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/api/patient-record/appointments/:id', async (req, res) => {
    
    try {
    const result = await db.query(
      'UPDATE appointments SET appointment_date = $1, appointment_time = $2 WHERE id = $3 RETURNING *',
        [ req.body.appointment_date, req.body.appointment_time, req.params.id]
    );
    
    res.json(result.rows[0]);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;