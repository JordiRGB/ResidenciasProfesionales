const { Router } = require('express')
const router = Router();
const { signup, signin } = require('../controllers/user.controllers')

router.post('/users/signup', signup);

router.post('/users/signin', signin);

  
module.exports = router