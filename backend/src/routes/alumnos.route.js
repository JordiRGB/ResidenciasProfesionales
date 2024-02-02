const { Router } = require('express')
const fileUpload = require('express-fileupload');
const router = Router();
const { getAlumno, createAlumno, updateAlumno, deleteAlumno, getAlumnos, reciclajeAlumno, getReciclajeAlumnos, deleteReciclajeAlumno, restaurarAlumno, getAlumnosAceptados } = require('../controllers/alumnos.controllers');

<<<<<<< HEAD
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (_req, _file, cb) {
    cb(null, Date.now() + '-' + _file.originalname);
  },
});

const fileFilter = (_req, _file, cb) => {
  if (_file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


const { getAlumno, createAlumno, updateAlumno, deleteAlumno, getAlumnos } = require( '../controllers/alumnos.controllers')

router.get('/get/alumno/:matricula', getAlumno)
router.get('/get/alumnos', getAlumnos)
router.put('/update/alumno/:id', upload.single('evidencia'), updateAlumno);
router.post('/create/alumno', upload.single('evidencia'), createAlumno);
router.delete('/delete/alumno/:id', deleteAlumno)

module.exports = router
=======
// Middleware para gestionar la subida de archivos


router.get('/get/alumno/:matricula', getAlumno);
router.get('/get/alumnos', getAlumnos);
router.put('/update/alumno/:id', updateAlumno);
router.post('/create/alumno', createAlumno);
router.delete('/delete/alumno/:id', deleteAlumno);
router.post('/reciclaje/alumno/:id', reciclajeAlumno);
router.get('/get/reciclaje/alumnos', getReciclajeAlumnos);
router.delete('/delete/reciclaje/alumno/:id', deleteReciclajeAlumno);
router.post('/restaurar/alumno/:id', restaurarAlumno);
router.get('/get/alumnos/aceptados', getAlumnosAceptados);
>>>>>>> Solis/API

module.exports = router;


