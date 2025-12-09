const express = require('express');
const router = express.Router();
const { getAllSales } = require('../controllers/salesController');

router.get('/', getAllSales);

module.exports = router;

