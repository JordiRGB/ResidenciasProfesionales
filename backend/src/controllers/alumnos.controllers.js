const alumnoCtrl = {};
const { Alumno, Reciclaje, Aceptados } = require('../models/Alumno.js'); 
const mongoose = require('mongoose');






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

//reciclaje

alumnoCtrl.reciclajeAlumno = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener la información del alumno antes de moverlo a reciclaje
        const alumnoExistente = await Alumno.findById(id);

        // Verificar si el alumno existe
        if (!alumnoExistente) {
            return res.status(404).json(`Alumno with id ${id} not found`);
        }

        // Crear un nuevo documento en la colección de reciclaje con los datos del alumno
        const alumnoReciclado = await Reciclaje.create(alumnoExistente.toObject());

        // Obtener el nombre del archivo
        const evidencia = alumnoExistente.evidencia;

        // Eliminar el alumno de la colección principal
        await Alumno.findByIdAndDelete(id);

        // No mover ni copiar el archivo, mantenerlo en la carpeta uploads
        // Puedes agregar aquí lógica adicional si es necesario

        res.status(200).json(alumnoReciclado);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
        console.error(error);
    }
};


alumnoCtrl.getReciclajeAlumnos = async (req, res) => {
    try {
        const reciclajes = await Reciclaje.find();
        res.status(200).json(reciclajes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
        console.error(error);
    }
};

alumnoCtrl.deleteReciclajeAlumno = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener la información del alumno antes de eliminarlo
        const alumnoExistente = await Reciclaje.findById(id);

        // Verificar si el alumno existe
        if (!alumnoExistente) {
            return res.status(404).json(`Alumno with id ${id} not found`);
        }

        // Eliminar el archivo PDF asociado al alumno
        const rutaArchivo = `uploads/${alumnoExistente.evidencia}`;
        await fs.promises.unlink(rutaArchivo);

        // Eliminar el alumno de la base de datos
        const alumnoEliminado = await Reciclaje.findByIdAndDelete(id);

        res.status(200).json(alumnoEliminado);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.error(error);
    }
};

alumnoCtrl.restaurarAlumno = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el ID es null o no es un ObjectId válido
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID provided' });
        }

        // Obtener la información del alumno antes de restaurarlo desde reciclaje
        const alumnoReciclado = await Reciclaje.findById(id);

        // Verificar si el alumno existe en reciclaje
        if (!alumnoReciclado) {
            return res.status(404).json(`Alumno in Reciclaje with id ${id} not found`);
        }

        // Obtener el nombre del archivo
        const evidencia = alumnoReciclado.evidencia;

        // No mover ni copiar el archivo, mantenerlo en la carpeta uploads
        // Puedes agregar aquí lógica adicional si es necesario

        // Eliminar el alumno de la colección de reciclaje
        await Reciclaje.findByIdAndDelete(id);

        // Crear un nuevo documento en la colección de Alumno con los datos del alumno reciclado
        const alumnoRestaurado = await Alumno.create(alumnoReciclado.toObject());

        res.status(200).json(alumnoRestaurado);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
        console.error(error);
    }
};

alumnoCtrl.aceptarAlumno = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener la información del alumno antes de moverlo a aceptados
        const alumnoExistente = await Alumno.findById(id);

        // Verificar si el alumno existe
        if (!alumnoExistente) {
            return res.status(404).json(`Alumno with id ${id} not found`);
        }

        // Crear un nuevo documento en la colección de aceptados con los datos del alumno
        const alumnoAceptado = await Aceptados.create({
            // Asegúrate de agregar todos los campos necesarios aquí
            matricula: alumnoExistente.matricula,
            nombreCom: alumnoExistente.nombreCom,
            telefono: alumnoExistente.telefono,
            casoEsta: 'Aceptado',
            direccion: alumnoExistente.direccion,
            carrera: alumnoExistente.carrera,
            casoTipo: alumnoExistente.casoTipo,
            semestre: alumnoExistente.semestre,
            correo: alumnoExistente.correo,
            motivosAca: alumnoExistente.motivosAca,
            motivosPer: alumnoExistente.motivosPer,
            evidencia: alumnoExistente.evidencia

        });

        // Eliminar el alumno de la colección principal
        await Alumno.findByIdAndDelete(id);

        res.status(200).json(alumnoAceptado);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
        console.error(error);
    }
};
alumnoCtrl.getaceptarAlumno = async (req, res) => {
    try {
        const aceptados = await Aceptados.find();
        res.status(200).json(aceptados);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
        console.error(error);
    }
};


module.exports = alumnoCtrl;
