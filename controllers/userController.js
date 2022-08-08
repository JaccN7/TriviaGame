const { response } = require('express');
const firebase = require('../config/conexionDB');
const User = require('../models/User');
const fireStore = firebase.firestore();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

//Renderizar página de registro
const pageSignUp = (req, res, next) => {
    res.render('registroUsuario');
}

//Renderizar página de login
const pageLogin = (req, res, next) => {
    res.render('loginUsuario');
}

//Crear usuario
const signUp = async (req, res, next) => {
    let userName = "Anónimo"; 
    let userType = "Invitado";
    try {
        //Usuario existe
        const users = await fireStore.collection('user').where('userName', '==', req.body.userName).get();
        if (!users.empty) return res.render('error', { message: "El usuario ya existe", userName: userName, userType: userType });

        //Crear Usuario
        //Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.userPassword, salt);
        //Crear usuario default
        const user = ({
            userName: req.body.userName,
            userPassword: hash,
            userType: 'userPlayer',
            userStatus: 'active'
        });
        const userCreated = await fireStore.collection('user').add(user);
        req.originalUrl.includes('web') ?
            res.redirect('/') :
            res.status(201).json({ message: "Usuario creado correctamente", newUser: user });
    } catch (error) {
        req.originalUrl.includes('web') ?
            res.render('error', { message: "Error al registrar usuario", error: error.message, userName: userName, userType: userName }) :
            res.status(500).json({ message: "Error al registrar usuario", error: error.message });
    }
}

//Iniciar sesión
const login = async (req, res, next) => {
    let username = "Anónimo"; 
    let userType = "Invitado";
    try {
        const userName = await fireStore.collection('user').where('userName', '==', req.body.userName).get();
        //Usuario no existe
        if (userName.empty) return res.render('error', { message: "El usuario no existe", userName: username, userType: userType });

        //Obtener el id del usuario
        const user = await fireStore.collection('user').doc(userName.docs[0].id).get();
        //buscar los datos del userName ingresado
        const checkPassword = await bcrypt.compare(req.body.userPassword, user.data().userPassword);
        if (!checkPassword) return res.render('error', { message: "Contraseña incorrecta", userName: username, userType: userType });
            
        //UserName y contraseña correctos
        //crear token
        const token = jwt.sign({ userName: user.data().userName }, process.env.JWT_KEY, { expiresIn: '6h' });

        req.session.userIdentification = ({
            token: token,
            userName: user.data().userName,
            userType: user.data().userType,
            userStatus: user.data().userStatus
        })
        req.originalUrl.includes('web') ? res.redirect('/') : res.status(200).json({ message: "Inicio de sesión correcto", token: token });
    } catch (error) {
        req.originalUrl.includes('web') ?
            res.render('error', { message: "Error al iniciar sesión", error: error.message, userName: username, userType: userType }) :
            res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
}

//Cerrar sesión
const logout = async (req, res, next) => {
    let userName, userType;
    req.session.userIdentification ? userName = req.session.userIdentification.userName : userName = "Anónimo";
    req.session.userIdentification ? userType = req.session.userIdentification.userType : userType = "Invitado";
    try {
        req.session.destroy();
        req.originalUrl.includes('web') ? res.redirect('/') : res.status(200).json({ message: "Sesión cerrada" });
    } catch (error) {
        req.originalUrl.includes('web') ?
            res.render('error', { message: "Error al cerrar sesión", error: error.message, userName: userName, userType: userType }) :
            res.status(500).json({ message: "Error al cerrar sesión", error: error.message });
    }
}

//Eliminar usuario - Solo para userTyper admin
const deleteUsers = async (req, res, next) => {
    try {
        const users = await fireStore.collection('user').get();
        users.docs.forEach(async (doc) => {
            await fireStore.collection('user').doc(doc.id).delete();
        }
        );
        res.status(200).json({ message: "Usuarios eliminados" });
    } catch (error) {
        if (req.originalUrl.includes('web'))
            res.render('error', { message: "Error al eliminar usuarios", error: error.message });
        else
            res.status(500).json({ message: "Error al eliminar usuarios", error: error.message });
    }
}

//Ver Usuario Registrados - Solo para userTyper admin
const registeredUsers = async (req, res, next) => {
    let userName, userType;
    req.session.userIdentification ? userName = req.session.userIdentification.userName : userName = "Anónimo";
    req.session.userIdentification ? userType = req.session.userIdentification.userType : userType = "Invitado";
    try {
        const usersData = await fireStore.collection('user').get();
        const usersDataArray = [];
        usersData.docs.forEach(doc => {
            const users = ({
                id: doc.id,
                userName: doc.data().userName,
                userType: doc.data().userType,
                userStatus: doc.data().userStatus
            });
            usersDataArray.push(users);
        });
        //Comprobar origen de la petición
        req.originalUrl.includes('web') ?
            res.render('adminWatchUsers', { usersDataArray: usersDataArray, userName: userName, userType: userType }) :
            res.status(200).json({ users: usersDataArray });
    } catch (error) {
        if (req.originalUrl.includes('web'))
            res.render('error', { message: "Error al obtener usuarios registrados", error: error.message, userName: userName, userType: userType });
        else
            res.status(500).json({ message: "Error al obtener usuarios registrados", error: error.message });
    }
}

//Ver información Usuario (Mi perfil) - 
//UserType: userPlayer puede ver su propio perfil con los datos de sus puntajes registrados
//UserType: admin puede ver el perfil de cualquier usuario
const userProfile = async (req, res, next) => {
    try {

    } catch (error) {
        if (req.originalUrl.includes('web'))
            res.render('error', { message: "Error al obtener perfil de usuario", error: error.message });
        else
            res.status(500).json({ message: "Error al obtener perfil de usuario", error: error.message });
    }
}

module.exports = {
    pageSignUp,
    pageLogin,
    signUp,
    login,
    deleteUsers,
    registeredUsers,
    userProfile,
    logout
}