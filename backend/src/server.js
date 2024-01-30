const express = require('express');
const methodOverride = require('method-override');
const flash = require('connect-flash'); 
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');

// Initialization
const app = express(); // Mueve esta línea arriba para inicializar 'app' antes de usarlo
require('./config/passport');

// Body parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cors
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
}));

// Middlewares
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {
    res.locals.succes_mgs = req.flash('success_mgs');
    next();
});

// Settings
app.use(express.json());
app.set('port', process.env.PORT || 4000);

// Routes
app.use('/api', require('./routes/user.route'));
app.use('/api', require('./routes/alumnos.route'));

module.exports = app;
