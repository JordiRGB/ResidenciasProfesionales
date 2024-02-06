const alumnoCtrl = {};
const { Alumno, Reciclaje} = require('../models/Alumno.js'); 
const EMAIL_COMI = process.env.EMAIL_COMI;
const USER_COMI = process.env.USER_COMI;
const nodemailer = require('nodemailer');
const fs = require('fs');
const mongoose = require('mongoose');




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
    const { matricula, nombreCom, telefono, casoEsta, direccion, carrera, casoTipo, semestre, correo, motivosAca, motivosPer, motivoComi } = req.body;
    const evidencia = req.file.filename;

    // Crear el nuevo alumno en la base de datos
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
        motivoComi: '', 
    });

    // Configuración del transporte para nodemailer (ajustar según tu proveedor de correo)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: USER_COMI,
          pass: EMAIL_COMI,
        },
      });

    // Contenido del correo electrónico
    const mailOptions = {
        from: USER_COMI,
        to: correo,
      subject: 'Solicitud recibida',
      text: `Hola ${nombreCom},\n\nTu solicitud ha sido recibida con éxito. Gracias por enviarla.\n\nEn breve sera revizada, te pedimos estar atento, \nSaludos!!`,
    };

    // Envía el correo electrónico
    await transporter.sendMail(mailOptions);

    // Respuesta a la solicitud del estudiante
    res.status(201).json({ message: 'Alumno creado con éxito. Se ha enviado un correo de confirmación.' });
  } catch (error) {
    console.error('Error al crear el alumno o enviar el correo electrónico:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


alumnoCtrl.updateAlumno = async (req, res) => {
    try {
        const { id } = req.params;
        const { matricula, nombreCom, telefono, casoEsta, direccion, carrera, casoTipo, semestre, correo, motivosAca, motivosPer, motivoComi, motivoRechazo } = req.body;
        let updateFields = {
            matricula,
            nombreCom,
            telefono,
            direccion,
            carrera,
            casoTipo,
            semestre,
            correo,
            motivosAca,
            motivosPer,
            motivoRechazo,
            casoEsta: "Rechazado",
        };

        // Agregar motivoComi solo si casoEsta es "Aceptado2"
        if (casoEsta === "Aceptado2") {
            updateFields.motivoComi = 'Aceptado por el Comite Academico';
        } else {
            // Agregar motivoComi solo si casoEsta es "Rechazar"
            if (casoEsta === "Rechazar") {
                updateFields.motivoComi = motivoComi || 'Motivo no especificado';
            }
        }

        if (req.file) {
            // Obtener la ruta del archivo actual
            const alumnoExistente = await Alumno.findById(id);
            if (alumnoExistente && alumnoExistente.evidencia) {
                const rutaArchivoActual = alumnoExistente.evidencia;

                // Eliminar el archivo actual utilizando promesas
                await unlinkAsync(`uploads/${rutaArchivoActual}`);

                // Actualizar el campo evidencia con el nuevo archivo
                updateFields.evidencia = req.file.filename;
            }
        }
        
        const alumno = await Alumno.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );

        if (!alumno) {
            return res.status(404).json(`Alumno with id ${id} not found`);
        }

        // Enviar correo si el estado es "Rechazar"
       
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: USER_COMI,
                    pass: EMAIL_COMI,
                },
                debug: true, // Habilita logs de depuración
            });

            let mailSubject, mailText;
        if (casoEsta === "Rechazar") {
            mailSubject = 'Solicitud Rechazada';
            mailText =` Hola ${nombreCom},\n\nTu solicitud ha sido rechazada. Motivo: ${updateFields.motivoComi}\n\nSaludos, \nTu Aplicación`;
        } else if (casoEsta === "Aceptado2") {
            mailSubject = 'Solicitud Aceptada';
            mailText = `Hola ${nombreCom},\n\nTu solicitud ha sido aceptada. Por favor, pasa lo antes posible con el Comité Academico\n\nSaludos`;
        }
            const mailOptions = {
                from: USER_COMI,
                to: correo,
                subject: 'Solicitud Aceptada',
                text: `Hola ${nombreCom},\n\nTu solicitud ha sido aceptada. Por favor pasa lo antes posible con el Comite Academico\n\nSaludos`,
            };

            await transporter.sendMail(mailOptions);
        
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
//aceptados
alumnoCtrl.getAlumnosAceptados = async (req, res) => {
    try {
      // Busca los alumnos con "Aceptado" en el campo casoEsta
      const alumnosAceptados = await Alumno.find({ casoEsta: 'Aceptado' });
  
      // Envía la lista de alumnos como respuesta
      res.status(200).json({ alumnos: alumnosAceptados });
    } catch (error) {
      console.error('Error al obtener los alumnos aceptados:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  };
// rechazarAlumno

alumnoCtrl.rechazarAlumno = async (req, res) => {
    try {
      const { id } = req.params;
      const { motivoRechazo } = req.body;
  
      const updateFields = {
        motivoRechazo,
        casoEsta: 'Rechazado',
        motivoComi: motivoRechazo || 'Motivo no especificado', 
      };
  
      const alumno = await Alumno.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
      );
  
      if (!alumno) {
        return res.status(404).json(`Alumno with id ${id} not found`);
      }
  
      // Enviar correo de rechazo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: USER_COMI,
          pass: EMAIL_COMI,
        },
        debug: true,
      });
  
      const mailOptions = {
        from: USER_COMI,
        to: alumno.correo,
        subject: 'Solicitud Rechazada',
        text: `Hola ${alumno.nombreCom},\n\nTu solicitud ha sido rechazada. Motivo: ${motivoRechazo || 'Motivo no especificado'}\n\nSaludos, \nTu Aplicación`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json(alumno);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
      console.error(error);
    }
  };
  alumnoCtrl.aceptarAlumno = async (req, res) => {
    try {
        const { id } = req.params;

        const updateFields = {
            casoEsta: 'Aceptado',  // Cambiado de 'Rechazado' a 'Aceptado'
        };

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



module.exports = alumnoCtrl;
