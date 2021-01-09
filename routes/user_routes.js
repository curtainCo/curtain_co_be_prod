const express = require('express');
const router = express.Router();
const { checkAdmin, checkAdminOrOwner } = require('../middlewares/auth');
const { indexUsers, showUser, changeUser, deleteUser } = require('../controllers/users_controllers');


router.get('/', checkAdmin, indexUsers);
router.get('/:id', checkAdminOrOwner, showUser);
router.put('/:id', checkAdminOrOwner, changeUser);
router.delete('/:id', checkAdminOrOwner, deleteUser);

module.exports = router;