const { Router } = require('express')
const router = Router();

const {conversor, Act} = require('../controllers/acta.controllers')

router.get('/acta/number', conversor);
router.put('/acta/number', Act);

module.exports = router