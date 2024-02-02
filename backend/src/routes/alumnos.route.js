const { Router } = require('express')
const fileUpload = require('express-fileupload');
const router = Router();
const { getAlumno, createAlumno, updateAlumno, deleteAlumno, getAlumnos, reciclajeAlumno, getReciclajeAlumnos, deleteReciclajeAlumno, restaurarAlumno, getAlumnosAceptados } = require('../controllers/alumnos.controllers');

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

module.exports = router;


