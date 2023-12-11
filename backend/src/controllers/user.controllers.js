const usersCtrl= {};
const passport = require('passport'); 
const User = require('../models/User');
const jwt = require('jsonwebtoken');

usersCtrl.signup =  async (req, res)=>{
  const{name,email, password}= req.body;
  const newUser = new User({name,email, password})

  newUser.password = await newUser.encryptPasswords(newUser.password);
  newUser.save()
  .then(savedUser => {
    console.log('Usuario guardado con contraseña encriptada:', savedUser);
  })
  .catch(error => {
    console.error('Error al guardar el usuario:', error);

  });

  const token = jwt.sign({_id: newUser._id}, 'secretkey')
  res.status(200).json({token})
};

usersCtrl.signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    const token = user.token;
    res.status(200).json({ token });
  })(req, res, next);
}


module.exports = usersCtrl;
