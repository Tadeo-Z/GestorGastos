const { AppError } = require("../util/AppError");
const UserDAO = require("../dataAccess/userDAO");
const { auth, generateToken } = require("../util/auth");
const bcrypt = require("bcrypt");

const getUsers = async (req, res, next) => {
  try {
    const users = await UserDAO.getAllUsers();
    res.status(200).json(users.map((user) => user.toJSON())); // 200 OK
  } catch (error) {
    next(new AppError("No se pudieron obtener los usuarios", 500)); // Enviar al middleware de manejo de errores
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserDAO.getUserById(id);

    res.json(user);
  } catch (error) {
    throw new AppError(`No se pudo obtener el usuario ${id}`, 500);
  }
};

const getUserByName = async (req, res) => {
  try {
    const { name } = req.params;
    const user = await UserDAO.getUserByName(name);

    res.json(user);
  } catch (error) {
    throw new AppError(`No se pudo obtener el usuario ${id}`, 500);
  }
}

const registerUser = async (req, res, next) => {
  try {
    const { name, paternalSurname, maternalSurname, password } = req.body;

    const existingUser = await UserDAO.getUserByName(name);
    if (existingUser) {
      return next(new AppError("El nombre de usuario ya existe", 400));
    }

    if (!name || !paternalSurname || !maternalSurname || !password) {
      return next(new AppError("Faltan campos obligatorios", 400));
    }

    if (password.length < 6) {
      return next(
        new AppError("La contraseña debe tener al menos 6 caracteres", 400)
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserDAO.createUser({
      name,
      paternalSurname,
      maternalSurname,
      entryDate: new Date(), // Aqui se genera la fecha en automatico
      password: hashedPassword, // Contraseña hasheada
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      user: userResponse,
    }); // 201 Created
  } catch (error) {
    next(new AppError("No se pudo agregar el usuario: " + error.message, 500));
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, paternalSurname, maternalSurname, entryDate, password } =
      req.body;

    if (
      (!name || !paternalSurname || !maternalSurname, !entryDate, !password)
    ) {
      throw new AppError("Faltan campos obligatorios", 500);
    }

    const user = {
      name: name,
      paternalSurname: paternalSurname,
      maternalSurname: maternalSurname,
      entryDate: entryDate,
      password: password,
    };

    await UserDAO.updateUser(id, user);
    res.json(user);
  } catch (error) {
    throw new AppError(`No se pudo actualizar el usuario ${id}`, 500);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await UserDAO.getUserById(id);
    if (!user) {
      return next(new AppError("Usuario no encontrado", 404));
    }

    await UserDAO.deleteUser(id);
    res.status(204).send(); // 204 No Content, no retorna cuerpo
  } catch (error) {
    next(new AppError("No se pudo eliminar el usuario", 500));
  }
};

const loginUser = async (req, res, next) => {
  const { name, password } = req.body;
  console.log("Datos recibidos:", { name, password }); // Verifica los datos enviados

  try {
    const user = await UserDAO.getUserByName(name); // Busca al usuario
    if (!user) {
      return next(new AppError("Credenciales invalidas", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Credenciales invalidas", 401));
    }

    const token = generateToken(user);

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      token,
      usuario: userResponse,
    });
  } catch (error) {
    console.error("Error al autenticar:", error); // Muestra el error en consola
    next(new AppError("Error al autenticar al usuario", 500));
  }
};

module.exports = {
  getUsers,
  getUser,
  getUserByName,
  registerUser,
  updateUser,
  deleteUser,
  loginUser
};
