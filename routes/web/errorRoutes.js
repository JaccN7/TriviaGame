const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    const error = new Error('No encontrado');
    error.status = 404;
    next(error);
});

router.use((error, req, res, next) => {
    let userName = '', userType = '';
    req.session.userIdentification ? userName = req.session.userIdentification.userName : userName = "Anónimo";
    req.session.userIdentification ? userType = req.session.userIdentification.userType : userType = "Invitado";
    console.log(userName);
    console.log(userType);
    res.status(error.status || 500).render("error", { message: "Se ha presentado un error", userName: userName, userType: userType });
});

module.exports = {
    routes: router
};