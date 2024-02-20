const alumnoCtrl = {};
const { Alumno, Reciclaje } = require('../models/Alumno.js');
const EMAIL_COMI = process.env.EMAIL_COMI;
const USER_COMI = process.env.USER_COMI;
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');


// Utilizamos promisify para convertir fs.unlink en una función que devuelve una promesa
const unlinkAsync = require('util').promisify(fs.unlink);

alumnoCtrl.getAlumnosComi = async (req, res) => {
    try {
        // Obtener todos los alumnos de la base de datos cuyo casoEsta sea igual a "AceptadoJefes"
        const alumnos = await Alumno.find({ casoEsta: "AceptadoJefe" });

        // Verificar si se encontraron alumnos con el estado "AceptadoJefes"
        if (alumnos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron alumnos con estado "AceptadoJefes".' });
        }

        // Mapear los alumnos para ajustar la respuesta
        const alumnosConEvidencia = alumnos.map(alumno => {
            return {
                _id: alumno._id,
                matricula: alumno.matricula,
                nombreCom: alumno.nombreCom,
                telefono: alumno.telefono,
                casoEsta: alumno.casoEsta,
                direccion: alumno.direccion,
                carrera: alumno.carrera,
                casoTipo: alumno.casoTipo,
                semestre: alumno.semestre,
                correo: alumno.correo,
                motivosAca: alumno.motivosAca,
                motivosPer: alumno.motivosPer,
                evidencia: {
                    url: `${req.protocol}://${req.get('host')}/api/alumnos/${alumno._id}/pdf`, // Ruta para ver el PDF del alumno
                    fileName: `evidencia_${alumno._id}.pdf`, // Nombre del archivo
                    contentType: alumno.contentType, // Tipo de contenido
                },
                motivoComi: alumno.motivoComi,
            };
        });

        res.status(200).json(alumnosConEvidencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los alumnos.' });
    }
};


alumnoCtrl.getAlumnosJefes = async (req, res) => {
    try {
        // Obtener el nombre de la carrera desde los parámetros de la solicitud
        const { carrera } = req.params;

        // Buscar todos los alumnos de la base de datos que pertenecen a la carrera especificada
        const alumnos = await Alumno.find({ carrera });

        // Verificar si se encontraron alumnos para esa carrera
        if (alumnos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron alumnos para esta carrera.' });
        }

        // Mapear los alumnos para ajustar la respuesta
        const alumnosConEvidencia = alumnos.map(alumno => {
            return {
                id: alumno._id,
                matricula: alumno.matricula,
                nombreCom: alumno.nombreCom,
                telefono: alumno.telefono,
                casoEsta: alumno.casoEsta,
                direccion: alumno.direccion,
                carrera: alumno.carrera,
                casoTipo: alumno.casoTipo,
                semestre: alumno.semestre,
                correo: alumno.correo,
                motivosAca: alumno.motivosAca,
                motivosPer: alumno.motivosPer,
                evidencia: {
                    url: `${req.protocol}://${req.get('host')}/api/alumnos/${alumno._id}/pdf`, // Ruta para ver el PDF del alumno
                    fileName: `evidencia_${alumno._id}.pdf`, // Nombre del archivo
                    contentType: alumno.contentType, // Tipo de contenido
                },
                motivoComi: alumno.motivoComi,
            };
        });

        // Ordenar los alumnos por nombreCom (nombre completo) de forma ascendente
        alumnosConEvidencia.sort((a, b) => a.nombreCom.localeCompare(b.nombreCom));

        res.status(200).json(alumnosConEvidencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los alumnos.' });
    }
};

alumnoCtrl.getAlumnoMatricula = async (req, res) => {
    try {
        // Obtener la matrícula desde los parámetros de la solicitud
        const { matricula } = req.params;

        // Buscar el alumno por matrícula en la base de datos
        const alumno = await Alumno.findOne({ matricula });

        // Verificar si el alumno existe
        if (!alumno) {
            return res.status(404).json({ message: 'Alumno no encontrado.' });
        }

        // Mapear el alumno para ajustar la respuesta
        const alumnoConEvidencia = {
            matricula: alumno.matricula,
            nombreCom: alumno.nombreCom,
            telefono: alumno.telefono,
            casoEsta: alumno.casoEsta,
            direccion: alumno.direccion,
            carrera: alumno.carrera,
            casoTipo: alumno.casoTipo,
            semestre: alumno.semestre,
            correo: alumno.correo,
            motivosAca: alumno.motivosAca,
            motivosPer: alumno.motivosPer,
            evidencia: {
                url: `${req.protocol}://${req.get('host')}/api/alumnos/${alumno._id}/pdf`, // Ruta para ver el PDF del alumno
                fileName: `evidencia_${alumno._id}.pdf`, // Nombre del archivo
                contentType: alumno.contentType, // Tipo de contenido
            },
            motivoComi: alumno.motivoComi,
        };

        res.status(200).json(alumnoConEvidencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el alumno.' });
    }
};



alumnoCtrl.getAlumnos = async (req, res) => {
    try {
        const alumnos = await Alumno.find();
        const alumnosWithFileURLs = alumnos.map(alumno => {
            // Obtener el nombre del archivo de evidencia del alumno
            const evidenciaFileName = alumno.evidencia.fileName;

            // Crear la URL completa del archivo PDF
            const fileURL = `/uploads/${evidenciaFileName}`;

            // Devolver la información del alumno con la URL del archivo PDF
            return {
                ...alumno.toObject(),
                evidenciaURL: fileURL,
            };
        });

        res.status(200).json(alumnosWithFileURLs);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};

alumnoCtrl.getAlumnos = async (req, res) => {
    try {
        // Obtener todos los alumnos de la base de datos
        const alumnos = await Alumno.find();

        // Mapear los alumnos para ajustar la respuesta
        const alumnosConEvidencia = alumnos.map(alumno => {
            return {
                matricula: alumno.matricula,
                nombreCom: alumno.nombreCom,
                telefono: alumno.telefono,
                casoEsta: alumno.casoEsta,
                direccion: alumno.direccion,
                carrera: alumno.carrera,
                casoTipo: alumno.casoTipo,
                semestre: alumno.semestre,
                correo: alumno.correo,
                motivosAca: alumno.motivosAca,
                motivosPer: alumno.motivosPer,
                evidencia: {
                    url: `${req.protocol}://${req.get('host')}/api/alumnos/${alumno._id}/pdf`, // Ruta para ver el PDF del alumno
                    fileName: `evidencia_${alumno._id}.pdf`, // Nombre del archivo
                    contentType: alumno.contentType, // Tipo de contenido
                },
                motivoComi: alumno.motivoComi,
            };
        });

        // Ordenar los alumnos por nombreCom (nombre completo) de forma ascendente
        alumnosConEvidencia.sort((a, b) => a.nombreCom.localeCompare(b.nombreCom));

        res.status(200).json(alumnosConEvidencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los alumnos.' });
    }
};


alumnoCtrl.createAlumno = async (req, res) => {
    try {
        const { matricula, nombreCom, telefono, casoEsta, direccion, carrera, casoTipo, semestre, correo, motivosAca, motivosPer, motivoComi } = req.body;

        // Verificar si se ha subido un archivo
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha proporcionado un archivo de evidencia.' });
        }

        // Leer el contenido del archivo PDF
        const evidenciaData = fs.readFileSync(req.file.path);
        const evidenciaContentType = req.file.mimetype;

        // Cambiar el tamaño del Buffer de la evidencia si es necesario (opcional)
        // Aquí puedes ajustar el tamaño del Buffer según tus necesidades
        const nuevoTamaño = 1024 * 1024; // 1 MB en bytes
        const evidenciaDataAjustada = Buffer.alloc(nuevoTamaño);
        evidenciaData.copy(evidenciaDataAjustada);

        // Crear el alumno con la evidencia como un buffer
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
            evidencia: { data: evidenciaDataAjustada, contentType: evidenciaContentType },
            motivoComi: '', // Agrega un campo vacío para el motivo de rechazo
        });

        // Eliminar el archivo temporal después de leer su contenido (opcional)
        fs.unlinkSync(req.file.path);

        // Configuración del transporte para nodemailer (ajustar según tu proveedor de correo)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: USER_COMI, // Cambia esto por tu correo electrónico
                pass: EMAIL_COMI, // Cambia esto por tu contraseña
            },
        });

        // Contenido del correo electrónico
        const mailOptions = {
            from: USER_COMI, // Cambia esto por tu correo electrónico
            to: correo,
            subject: 'Solicitud recibida',
            text: `Hola ${nombreCom},\n\nTu solicitud ha sido recibida con éxito. Gracias por enviarla.\n\nEn breve será revisada. Te pedimos estar atento.\nSaludos!!`,
        };

        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);

        res.status(201).json(newAlumno);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el alumno.' });
    }
};

alumnoCtrl.getAlumnoPdf = async (req, res) => {
    try {
        const alumno = await Alumno.findById(req.params.id);

        // Verificar si el alumno existe
        if (!alumno) {
            return res.status(404).json({ message: 'Alumno no encontrado.' });
        }

        // Verificar si hay evidencia adjunta
        if (!alumno.evidencia || !alumno.evidencia.data) {
            return res.status(404).json({ message: 'No hay evidencia adjunta para este alumno.' });
        }

        // Establecer encabezados para indicar que se está enviando un archivo PDF
        res.setHeader('Content-Type', 'application/pdf');

        // Enviar el archivo PDF como respuesta
        res.send(alumno.evidencia.data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el archivo PDF del alumno.' });
    }
};


alumnoCtrl.updateJefes = async (req, res) => {
    try {
        const { id } = req.params;
        const { matricula, nombreCom, telefono, casoEsta, direccion, carrera, casoTipo, semestre, correo, motivosAca, motivosPer, motivoComi } = req.body;

        let updateFields = {
            matricula,
            nombreCom,
            telefono,
            casoEsta,//Aceptado
            direccion,
            carrera,
            casoTipo,
            semestre,
            correo,
            motivosAca,
            motivosPer,
        };

        // Agregar motivoComi solo si casoEsta es "Aceptado"
        if (casoEsta === "AceptadoJefe") {
            updateFields.motivoComi = 'Aceptado por Jefe/a de Carrera';
        } else {
            // Agregar motivoComi solo si casoEsta es "Rechazar"
            if (casoEsta === "RechazarJefe") {
                updateFields.motivoComi = motivoComi || 'Motivo no especificado';
                let jefeNombre, passJefe;//se usara despues
                
                switch (carrera) {
                    case "Ingeniería en Sistemas Computacionales"://aqui se pondra el correo del jefe de carrera
                        jefeNombre = "Jefe/a de Carrera de Ingeniería en Sistemas Computacionales";
                        break;
                    
                    case "Ingeniería Industrial":
                        jefeNombre = "Jefe/a de Carrera de Ingeniería Industrial";
                        break;
                    
                    case "Ingeniería Electromecánica":
                        jefeNombre = "Jefe/a de Carrera de Ingeniería Electromecánica";
                        break;

                    case "Ingeniería Informática":
                        jefeNombre = "Jefe/a de Carrera de Ingeniería Informática";
                        break;

                    case "Ingeniería Electrónica":
                        jefeNombre = "Jefe/a de Carrera de Ingeniería Electrónica";
                        break;

                    case "Ingeniería en Administración":
                        jefeNombre = "Jefe/a de Carrera de Ingeniería en Administración";
                        break;
                }
                // Agrega estas líneas para asegurar que las variables estén disponibles fuera del bloque
                updateFields.jefeNombre = jefeNombre;
                updateFields.passJefe = passJefe;
            }
        }

        // Verificar si se proporciona un nuevo archivo PDF
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

        // Enviar correo si el estado es "Rechazar" o "Aceptado2"
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: USER_COMI, //se agregara el nombreJefe
                pass: EMAIL_COMI, //se agregara passJefe
            },
        });

        let mailSubject, mailText;
        if (casoEsta === "RechazarJefe") {
            mailSubject = 'Solicitud Rechazada';
            mailText = `Hola ${nombreCom},\n\nTu solicitud ha sido rechazada por el/la ${updateFields.jefeNombre}. Motivo: ${updateFields.motivoComi}\n\nSaludos, \nTu Aplicación`;
        } else if (casoEsta === "AceptadoJefe") {
            mailSubject = 'Solicitud Aceptada';
            mailText = `Hola ${nombreCom},\n\nTu solicitud ha sido aceptada por el/la Jefe/a de Carrera. Te pedimos estar a tento a la decisión del COMITE DE CASOS ESPECIALES sobre tu caso\n\nSaludos`;
        }

        const mailOptions = {
            from: USER_COMI,
            to: correo,
            subject: mailSubject,
            text: mailText,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json(alumno);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.error(error);
    }
};

alumnoCtrl.updateSecre = async (req, res) => {
    try {
        const { id } = req.params;
        const { matricula, nombreCom, telefono, casoEsta, direccion, carrera, casoTipo, semestre, correo, motivosAca, motivosPer, motivoComi } = req.body;

        let updateFields = {
            matricula,
            nombreCom,
            telefono,
            casoEsta,//Aceptado
            direccion,
            carrera,
            casoTipo,
            semestre,
            correo,
            motivosAca,
            motivosPer,
        };

        // Agregar motivoComi solo si casoEsta es "Aceptado2"
        if (casoEsta === "AceptadoComi") {
            updateFields.motivoComi = 'Aceptado por el Comite Academico';
        } else {
            // Agregar motivoComi solo si casoEsta es "Rechazar"
            if (casoEsta === "RechazarComi") {
                updateFields.motivoComi = motivoComi || 'Motivo no especificado';
            }
        }

        // Verificar si se proporciona un nuevo archivo PDF
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

        // Enviar correo si el estado es "Rechazar" o "Aceptado2"
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: USER_COMI,
                pass: EMAIL_COMI,
            },
        });

        let mailSubject, mailText;
        if (casoEsta === "RechazarComi") {
            mailSubject = 'Solicitud Rechazada';
            mailText = `Hola ${nombreCom},\n\nTu solicitud ha sido rechazada. Motivo: ${updateFields.motivoComi}\n\nSaludos, \nTu Aplicación`;
        } else if (casoEsta === "AceptadoComi") {
            mailSubject = 'Solicitud Aceptada';
            mailText = `Hola ${nombreCom},\n\nTu solicitud ha sido aceptada. Por favor, pasa lo antes posible con el Comité Academico\n\nSaludos`;
        }

        const mailOptions = {
            from: USER_COMI,
            to: correo,
            subject: mailSubject,
            text: mailText,
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




module.exports = alumnoCtrl;

module.exports.fileUploadMiddleware = fileUpload;