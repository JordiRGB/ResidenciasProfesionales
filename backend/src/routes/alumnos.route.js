const { Router } = require('express')
const router = Router();
const multer = require('multer');




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


const { getAlumno,createAlumno, updateAlumno, deleteAlumno, getAlumnos, reciclajeAlumno, getReciclajeAlumnos, deleteReciclajeAlumno, restaurarAlumno, updateAlumno2 } = require( '../controllers/alumnos.controllers')

router.get('/get/alumno/:matricula', getAlumno)
router.get('/get/alumnos', getAlumnos)
router.put('/update/alumno/:id', upload.single('evidencia'), updateAlumno);
router.post('/create/alumno', upload.single('evidencia'), createAlumno);
router.delete('/delete/alumno/:id', deleteAlumno)
router.post('/reciclaje/alumno/:id', reciclajeAlumno)
router.get('/get/reciclaje/alumnos', getReciclajeAlumnos)
router.delete('/delete/reciclaje/alumno/:id', deleteReciclajeAlumno)
router.post('/restaurar/alumno/:id', restaurarAlumno)






module.exports = router



