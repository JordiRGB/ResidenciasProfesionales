const { Router } = require('express')
const router = Router();
const multer = require('multer');

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



