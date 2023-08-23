const express = require('express');
const router = express.Router();
const db = require('../db/index');



router.get('/api/patient-record/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categorii_test');
    res.status(200).json({
      status: 'success',
      result: result.rows.length,
      data: {
        categories: result.rows,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Retrieve a single category
router.get('/api/patient-record/categories/:id_categorie', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categorii_test WHERE id_categorie = $1', [
      req.params.id_categorie
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        category: result.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Update an existing category
router.put('/api/patient-record/categories/:id_categorie', async (req, res) => {
  const { nume_categorie } = req.body;
  try {
    const result = await db.query(
      'UPDATE categorii_test SET nume_categorie = $1 WHERE id_categorie = $2 RETURNING *',
      [nume_categorie, req.params.id_categorie]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        category: result.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Delete a category
router.delete('/api/patient-record/categories/:id_categorie', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM categorii_test WHERE id_categorie = $1 RETURNING *',
      [req.params.id_categorie]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found',
      });
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});


//////////////////////////////////////////////////////////////////////

// Retrieve tests by category ID
router.get('/api/patient-record/tests/:categoryId', async (req, res) => {
  const categoryId = req.params.categoryId;
  
  try {
    const result = await db.query('SELECT test_id, nume_test FROM test WHERE id_categorie = $1', [categoryId]);
    res.status(200).json({
      status: 'success',
      result: result.rows.length,
      data: {
        tests: result.rows,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Retrieve a single test
router.get('/api/patient-record/tests/:test_id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM test WHERE test_id = $1', [
      req.params.test_id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        test: result.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});



// Update an existing test
router.put('/api/patient-record/tests/:test_id', async (req, res) => {
  const { id_pacient, id_categorie, nume_test, tip_test, data_test, notite_test } = req.body;
  try {
    const result = await db.query(
      'UPDATE test SET id_pacient = $1, id_categorie = $2, nume_test = $3, tip_test = $4, data_test = $5, notite_test = $6 WHERE test_id = $7 RETURNING *',
      [id_pacient, id_categorie, nume_test, tip_test, data_test, notite_test, req.params.test_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        test: result.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Delete a test
router.delete('/api/patient-record/tests/:test_id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM test WHERE test_id = $1 RETURNING *', [
      req.params.test_id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found',
      });
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});
  
  module.exports = router;