const jwt = require('jsonwebtoken');

//verificar que el usuario sea administrador
module.exports= (req, res, next) => {
    try {
        const adminProfile = req.session.userIdentification.userType;
        if (adminProfile !== 'admin') {
            return res.render('error', { message: "No tienes permisos para acceder a esta página", error: "No tiene acceso a este recurso" });
        } else {
            next();
        }
    } catch (error) {
        return res.render('error', { message: "Error al verificar la sessión", error: error.message});
    }
}