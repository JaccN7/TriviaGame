const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/check_authentication');

const {pageSignUp, pageLogin, signUp, login, deleteUsers, registeredUsers} = require('../../controllers/userController');

//Registrar usuario
//Ruta para renderizar el formulario de registro de usuario
router.get('/signup', pageSignUp);
//Ruta para registrar un nuevo usuario
router.post('/registration', signUp);

//Iniciar Sessión
//Ruta para renderizar el formulario de inicio de sesión
router.get('/login', pageLogin);
//Ruta para iniciar sesión
router.post('/authenticate', login);

//Eliminar usuario - Solo para userTyper admin

//Ver Usuarios Registrados - Solo para userTyper admin
router.get('/registeredUsers', checkAuth, registeredUsers);

module.exports = {
    routes: router
};