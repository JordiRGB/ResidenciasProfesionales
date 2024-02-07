//import mongoose from "mongoose";
const {Schema , model}= require('mongoose');

//creamos un sqchema
const alumnoSchema = new Schema(
    {
        matricula: { type: Number, required: [true, "matricula is required"] },
        nombreCom: { type: String, required: [true, "nombreCom is required"] },
        telefono: { type: Number, required: [true, "telefono is required"] },
        casoEsta: { type: String, required: [true, "email is required"] },
        direccion: { type: String, required: [true, "direccion is required"] },
        carrera: { type: String, required: [true, "carrera is required"] },
        casoTipo: { type: String, required: [true, "coasoTipo is required"] },
        semestre: { type: Number, required: [true, "semestre is required"] },
        correo: { type: String, required: [true, "correo is required"] },
        motivosAca: { type: String, required: [true, "motivosAca is required"] },
        motivosPer: { type: String, required: [true, "MotivosPer is required"] },
        evidencia: { type: String, required: [true, "evidencia is required"] },
        motivoComi: { type: String},
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Creamos un modelo a partir del schema para Alumno
const Alumno = model('Alumno', alumnoSchema);

// Creamos un modelo a partir del mismo schema para Reciclaje
// Creamos un modelo a partir del mismo schema para Reciclaje
const Reciclaje = model('Reciclaje', alumnoSchema);


module.exports = { Alumno, Reciclaje };