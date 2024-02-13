const { Router } = require('express')
const router = Router();
const { getAlumno, createAlumno, updateJefes, updateSecre, deleteAlumno, getAlumnos, reciclajeAlumno, getReciclajeAlumnos, deleteReciclajeAlumno, restaurarAlumno, getAlumnosAceptados, rechazarJefe, aceptarJefe, rechazarComi, aceptarComi, historialJefe} = require('../controllers/alumnos.controllers');

const multer = require('multer');
// Middleware para gestionar la subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
  });

  
  
  const upload = multer({ storage });

router.get('/get/alumno/:matricula', getAlumno);
router.get('/get/alumnos', getAlumnos);
//router.put('/update/alumnoJefes/:id', updateJefes );
//router.put('/update/alumnoSecre/:id', updateSecre );
router.post('/create/alumno', upload.single('evidencia'), createAlumno);
router.delete('/delete/alumno/:id', deleteAlumno);
router.post('/reciclaje/alumno/:id', reciclajeAlumno);
router.get('/get/reciclaje/alumnos', getReciclajeAlumnos);
router.delete('/delete/reciclaje/alumno/:id', deleteReciclajeAlumno);
router.post('/restaurar/alumno/:id', restaurarAlumno);
router.get('/get/alumnos/aceptados', getAlumnosAceptados);

router.put('/rechazar/alumnoJefes/:id', rechazarJefe);
router.put('/aceptar/alumnoJefes/:id', aceptarJefe);
router.put('/rechazar/alumnoComi/:id', rechazarComi);
router.put('/aceptar/alumnoComi/:id', aceptarComi);
router.get('/historial/jefe', historialJefe);


module.exports = router;

