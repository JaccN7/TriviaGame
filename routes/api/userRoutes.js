const express = require('express');
const router = express.Router();

const {pageSignUp, pageLogin, signUp, login, changeUserStatus, registeredUsers} = require('../../controllers/userController');

//Crear usuario
router.post('/signup', signUp);

//Ingresar usuario
router.post('/login', login);

//Ver usuarios
router.get('/', registeredUsers);

//Borrar usuario
//router.delete('/', deleteUsers);

module.exports = {
    routes: router
};