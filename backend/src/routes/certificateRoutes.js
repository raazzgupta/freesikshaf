const express = require('express');
const router = express.Router();
const { createCertificate, getMyCertificates } = require('../controllers/certificateController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/generate', protect, createCertificate);
router.get('/my-certificates', protect, getMyCertificates);

module.exports = router;
