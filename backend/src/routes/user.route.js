const { Router } = require('express')
const router = Router();
const { signup, signin, createUser, getAllUsers, getUserByEmail, updateUser, deleteUser} = require('../controllers/user.controllers')

router.post('/users/signup', signup);

router.post('/users/signin', signin);

router.post('/users/create', createUser);
router.get('/users/get', getAllUsers);
router.get('/user/get/:email', getUserByEmail);
router.put('/users/update/:id', updateUser);
router.delete('/users/delete/:id', deleteUser);


  
module.exports = router