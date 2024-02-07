const express = require('express');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// Crear la aplicación Express
const app = express();

// Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());


// Configuración de CORS
app.use(
  cors({
    origin: 'http://localhost:4200',
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  })
);

// Middlewares
app.use(methodOverride('_method'));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Variables globales
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  next();
});

// Configuración de la aplicación
app.use(express.json());
app.set('port', process.env.PORT || 4000);

// Rutas
app.use('/api', require('./routes/user.route'));
app.use('/api', require('./routes/alumnos.route'));
app.use('/api', require('./routes/roles.route'));

<<<<<<< HEAD
//Routes

app.use('/api',require('./routes/user.route'));
app.use('/api',require('./routes/alumnos.route'));
app.use('/api',require('./routes/acta.route'));
module.exports = app;
=======
module.exports = app;
>>>>>>> jordi/comiteNew
