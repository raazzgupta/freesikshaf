const express = require('express');
const router = express.Router();
const { getAnalytics, getAllUsers } = require('../controllers/adminController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { authorize } = require('../middleware/roleMiddleware.js');

router.use(protect);
router.use(authorize('admin')); // All routes below require admin role

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);

module.exports = router;
