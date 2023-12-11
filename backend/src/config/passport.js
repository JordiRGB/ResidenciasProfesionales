const passport = require ('passport');
const LocalStrategy = require('passport-local').Strategy;
const user =require('../models/User');
const jwt = require('jsonwebtoken');


passport.use (new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'    
}, async (email, password, done)  =>{
    const User = await user.findOne({email})
    if(!User){
        return done(null, false, {message: 'Not User Found'});
    }else{
       const match = await User.matchPassword(password);
       if (match){
        const token = jwt.sign({ _id: User._id }, 'secretkey');
        User.token = token;
        return done (null, User);
       }else{
        return done (null, false, {message: 'Incorrect Password'});
       }
    }
}))

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  user.findById(id)
      .then(user => {
          done(null, user);
      })
      .catch(error => {
          done(error, null);
      });
});