const express = require('express');
const methodOverride = require('method-override');
const flash = require('connect-flash'); 
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const path = require('path'); 
const fs = require('fs');


// Initialization
const app = express();
require('./config/passport');

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

// Configuración para PDFS estáticos desde el directorio 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración adicional para enviar archivos PDF con el MIME Type correcto
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(PDF_BASE_PATH, filename);

});


app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Verificar si el archivo existe antes de enviarlo
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // El archivo no existe, devolver un error 404
      return res.status(404).send('File not found');
    }

    // El archivo existe, enviarlo con el MIME Type correcto y el encabezado Content-Disposition
    res.sendFile(filePath, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  });
});


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
