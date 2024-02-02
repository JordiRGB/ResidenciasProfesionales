const rolesCtrl = {};
const Roles = require('../models/Roles'); // Corrección en esta línea;

rolesCtrl.createRol = async (req, res) => {
    try {
        const nuevoRol = await Roles.create(req.body);
        res.status(201).json(nuevoRol);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

rolesCtrl.getRoles = async (req, res) => {
    try {
        const roles = await Roles.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

rolesCtrl.getRolId = async (req, res) => {
    try {
        const rol = await Roles.findById(req.params.id);
        if (!rol) {
            return res.status(404).json({ mensaje: 'Rol no encontrado' });
        }
        res.status(200).json(rol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

rolesCtrl.updateRol = async (req, res) => {
    try {
        const rolActualizado = await Roles.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!rolActualizado) {
            return res.status(404).json({ mensaje: 'Rol no encontrado' });
        }
        res.status(200).json(rolActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


rolesCtrl.deleteRol = async (req, res) => {
    try {
        const rolEliminado = await Roles.findByIdAndDelete(req.params.id);
        if (!rolEliminado) {
            return res.status(404).json({ mensaje: 'Rol no encontrado' });
        }
        res.status(200).json({ mensaje: 'Rol eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = rolesCtrl;