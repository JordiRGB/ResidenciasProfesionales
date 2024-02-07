const { Router } = require('express')
const router = Router();
const { getAlumno, createAlumno, updateJefes, updateSecre, deleteAlumno, getAlumnos, reciclajeAlumno, getReciclajeAlumnos, deleteReciclajeAlumno, restaurarAlumno, getAlumnosAceptados } = require('../controllers/alumnos.controllers');

// Middleware para gestionar la subida de archivos


<<<<<<< HEAD
router.get('/get/alumno/:matricula', getAlumno);
router.get('/get/alumnos', getAlumnos);
router.put('/update/alumnoJefes/:id', updateJefes );
router.put('/update/alumnoSecre/:id', updateSecre );
router.post('/create/alumno', createAlumno);
router.delete('/delete/alumno/:id', deleteAlumno);
router.post('/reciclaje/alumno/:id', reciclajeAlumno);
router.get('/get/reciclaje/alumnos', getReciclajeAlumnos);
router.delete('/delete/reciclaje/alumno/:id', deleteReciclajeAlumno);
router.post('/restaurar/alumno/:id', restaurarAlumno);
router.get('/get/alumnos/aceptados', getAlumnosAceptados);
=======
const { getAlumno,createAlumno, updateAlumno, deleteAlumno, getAlumnos, reciclajeAlumno, getReciclajeAlumnos, deleteReciclajeAlumno, restaurarAlumno, aceptarAlumno, getaceptarAlumno} = require( '../controllers/alumnos.controllers')

router.get('/get/alumno/:matricula', getAlumno)
router.get('/get/alumnos', getAlumnos)
router.put('/update/alumno/:id', upload.single('evidencia'), updateAlumno);
router.post('/create/alumno', upload.single('evidencia'), createAlumno);
router.delete('/delete/alumno/:id', deleteAlumno)
router.post('/reciclaje/alumno/:id', reciclajeAlumno);
router.get('/get/reciclaje/alumnos', getReciclajeAlumnos)
router.delete('/delete/reciclaje/alumno/:id', deleteReciclajeAlumno)
router.post('/restaurar/alumno/:id', restaurarAlumno)
router.post('/aceptar/alumnos/:id', aceptarAlumno);
router.get('/get/aceptados/alumnos', getaceptarAlumno);



// Middleware para manejar errores
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// Middleware final para manejar rutas no encontradas
router.use((req, res) => {
  res.status(404).send('Not Found');
});
module.exports = router
>>>>>>> origin/Ruiz

module.exports = router;

