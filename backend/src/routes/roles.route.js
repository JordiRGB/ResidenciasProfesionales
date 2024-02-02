const { Router } = require('express')
const router = Router();

const { createRol, getRoles, getRolId, updateRol, deleteRol  } = require('../controllers/roles.controllers')

router.post('/roles/create', createRol);
router.get('/roles/get', getRoles);
router.get('/roles/get/:id', getRolId);
router.put('/roles/update/:id', updateRol);
router.delete('/roles/delete/:id', deleteRol);

module.exports = router

