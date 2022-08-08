const express = require('express');
const router = express.Router();
const check_authentication = require('../../middleware/check_authentication');
const check_authorization = require('../../middleware/check_authorization');

const {pageSignUp, pageLogin, signUp, login, deleteUsers, registeredUsers, logout} = require('../../controllers/userController');

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
router.get('/registeredUsers', check_authentication, check_authorization, registeredUsers);

//Cerrar sesión
router.get('/logout', check_authentication, logout);

module.exports = {
    routes: router
};