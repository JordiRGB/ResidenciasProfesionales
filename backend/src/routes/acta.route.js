const { Router } = require('express')
const router = Router();

const {conversor} = require('../controllers/acta.controllers')

router.get('/acta/number', conversor);

module.exports = router