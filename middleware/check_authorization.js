const jwt = require('jsonwebtoken');

//Verificar permisos de usuario
module.exports= (req, res, next) => {
    let userName, userType;
    req.session.userIdentification ? userName = req.session.userIdentification.userName : userName = "Anónimo";
    req.session.userIdentification ? userType = req.session.userIdentification.userType : userType = "Invitado";
    try {
        const adminProfile = req.session.userIdentification.userType;
        if (adminProfile !== 'admin') {
            return res.render('error', { message: "No tienes permisos para acceder a esta página", error: "No tiene acceso a este recurso", userName: userName, userType: userType });
        } else {
            next();
        }
    } catch (error) {
        return res.render('error', { message: "Error al verificar la sessión", error: error.message, userName: userName, userType: userType});
    }
}