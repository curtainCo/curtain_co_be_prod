const express = require('express');
const router = express.Router();
const { checkAuthenticated, checkAdmin } = require('../middlewares/auth');
const { indexCollections, showCollection, createCollection, changeCollection, deleteCollection } = require('../controllers/collections_controller');

router.get('/', indexCollections);
router.post('/', checkAuthenticated, checkAdmin, createCollection);
router.get('/:id', showCollection);
router.put('/:id', checkAuthenticated, checkAdmin, changeCollection);
router.delete('/:id', checkAuthenticated, checkAdmin, deleteCollection);

module.exports = router;