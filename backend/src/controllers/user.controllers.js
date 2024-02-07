const usersCtrl= {};
const passport = require('passport'); 
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


usersCtrl.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign({ _id: newUser._id }, 'secretkey');
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error al guardar el usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

usersCtrl.signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    const token = user.token;
    res.status(200).json({ token });
  })(req, res, next);
}

// Crear un nuevo usuario
usersCtrl.createUser = async (req, res) => {
  const { name, email, password, roles } = req.body;

  try {
    // Hash de la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      roles: roles
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Error del servidor" });
    console.error(error);
  }
};

// Obtener todos los usuarios
usersCtrl.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
    console.error(error);
  }
};

// Obtener un usuario por email
usersCtrl.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json(`Usuario con email ${email} no encontrado`);
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
    console.error(error);
  }
};

// Actualizar un usuario por _id
usersCtrl.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json(`Usuario con _id ${id} no encontrado`);
    }

    console.log('Entró en updateUser');

    // Actualizar los campos necesarios
    if (req.body.name !== undefined) {
      user.name = req.body.name;
    }

    if (req.body.email !== undefined) {
      // Verificar si el nuevo correo electrónico es diferente al existente
      if (req.body.email !== user.email) {
        // Verificar si el nuevo correo electrónico ya existe en la base de datos
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json({ message: 'El nuevo correo electrónico ya está en uso' });
        }
        user.email = req.body.email;
      }
    }

    if (req.body.roles !== undefined) {
      user.roles = req.body.roles;
    }

    // Actualizar la contraseña solo si se proporciona un valor
    if (req.body.password !== undefined && req.body.password !== "") {
      // Hash de la nueva contraseña antes de almacenarla
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    console.log('Usuario actualizado:', updatedUser);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error del servidor" });
  }
};

// Borrar un usuario por _id
usersCtrl.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Agregar un registro para ver el valor de id
    console.log('Valor de id:', id);

    // Utilizamos deleteOne en lugar de remove
    const result = await User.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json(`Usuario con _id ${id} no encontrado`);
    }

    res.status(200).json({ message: `Usuario con _id ${id} eliminado exitosamente` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};


module.exports = usersCtrl;
