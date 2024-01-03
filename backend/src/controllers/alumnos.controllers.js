const alumnoCtrl = {};
const Alumno = require('../models/Alumno.js');
const fs = require('fs');

// Utilizamos promisify para convertir fs.unlink en una función que devuelve una promesa
const unlinkAsync = require('util').promisify(fs.unlink);

alumnoCtrl.getAlumno = async (req, res) => {
  try {
      const { matricula } = req.params;
      const alumno = await Alumno.findOne({ matricula: matricula });

      if (!alumno) {
          return res.status(404).json(`Alumno with matricula ${matricula} not found`);
      }

      res.status(200).json(alumno);
  } catch (error) {
      res.status(500).json({ message: "Server error" });
      console.error(error);
  }
};

alumnoCtrl.getAlumnos = async (req, res) => {
  try {
      const alumnos = await Alumno.find()
      res.status(200).json(alumnos)
  } catch (error) {
      req.status(500).json({ message:error.message })
      console.log(error);
  }
};

alumnoCtrl.createAlumno = async (req, res) => {
    try {
      const { matricula, nombreCom, telefono, casoEsta, direccion, carrera, casoTipo, semestre, correo, motivosAca, motivosPer } = req.body;
      const evidencia = req.file.filename;
  
      const newAlumno = await Alumno.create({
        matricula,
        nombreCom,
        telefono,
        casoEsta,
        direccion,
        carrera,
        casoTipo,
        semestre,
        correo,
        motivosAca,
        motivosPer,
        evidencia,
      });  
  
      res.status(201).json(newAlumno);
    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor' });
      console.log(error);
    }
  };

  alumnoCtrl.updateAlumno = async (req, res) => {
    try {
        const { id } = req.params;
        const { matricula, nombreCom, telefono, casoEsta, direccion, carrera, casoTipo, semestre, correo, motivosAca, motivosPer } = req.body;

        let updateFields = {
            matricula,
            nombreCom,
            telefono,
            casoEsta,
            direccion,
            carrera,
            casoTipo,
            semestre,
            correo,
            motivosAca,
            motivosPer,
        };

        // Verificar si se proporciona un nuevo archivo PDF
        if (req.file) {
            // Obtener la ruta del archivo actual
            const alumnoExistente = await Alumno.findById(id);
            const rutaArchivoActual = alumnoExistente.evidencia;

            // Eliminar el archivo actual utilizando promesas
            await unlinkAsync(`uploads/${rutaArchivoActual}`);

            // Actualizar el campo evidencia con el nuevo archivo
            updateFields.evidencia = req.file.filename;
        }

        const alumno = await Alumno.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );

        if (!alumno) {
            return res.status(404).json(`Alumno with id ${id} not found`);
        }

        res.status(200).json(alumno);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.error(error);
    }
};

alumnoCtrl.deleteAlumno = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener la información del alumno antes de eliminarlo
        const alumnoExistente = await Alumno.findById(id);

        // Verificar si el alumno existe
        if (!alumnoExistente) {
            return res.status(404).json(`Alumno with id ${id} not found`);
        }

        // Eliminar el archivo PDF asociado al alumno
        const rutaArchivo = `uploads/${alumnoExistente.evidencia}`;
        await fs.promises.unlink(rutaArchivo);

        // Eliminar el alumno de la base de datos
        const alumnoEliminado = await Alumno.findByIdAndDelete(id);

        res.status(200).json(alumnoEliminado);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.error(error);
    }
};


module.exports = alumnoCtrl;
