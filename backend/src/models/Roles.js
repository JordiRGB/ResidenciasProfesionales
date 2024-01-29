const {Schema , model}= require('mongoose');

//creamos un sqchema
const rolesSchema = new Schema(
    {
        id_rol: { type: Number, required: [true, "matricula is required"] },
        nombreRol: { type: String, required: [true, "nombre is required"] },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Creamos un modelo a partir del schema para Alumno
const Roles = model('Rol', rolesSchema);


module.exports = Roles;