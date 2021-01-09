const express = require('express');
const router = express.Router();
const { indexConsults, showConsult, createConsult, changeConsult, deleteConsult } = require('../controllers/consults_controller');
const { checkAuthenticated, checkAdmin } = require('../middlewares/auth');

router.get('/', checkAuthenticated, checkAdmin, indexConsults);
router.post('/', createConsult);
router.get('/:id', checkAuthenticated, checkAdmin, showConsult);
router.patch('/:id', checkAuthenticated, checkAdmin, changeConsult);
router.delete('/:id', checkAuthenticated, checkAdmin, deleteConsult);

module.exports = router;