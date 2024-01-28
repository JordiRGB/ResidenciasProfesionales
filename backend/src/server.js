const express = require('express');
const methodOverride = require('method-override');
const flash = require('connect-flash'); 
const session = require('express-session');
const cors = require('cors');
const passport = require ('passport');



//Initialization
const app = express();
require('./config/passport');

app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,POST,OPTIONS', // Debes incluir OPTIONS
    allowedHeaders: 'Content-Type,Authorization', // Especifica los encabezados permitidos
  }));


  
//Middlewares


app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use((req, res, next)=> {
  res.locals.succes_mgs = req.flash('success_mgs');
  next();
});

//settings
app.use(express.json());
app.set('port', process.env.PORT || 4000);


//Routes

app.use('/api',require('./routes/user.route'));
app.use('/api',require('./routes/alumnos.route'));
app.use('/api',require('./routes/acta.route'));
module.exports = app;