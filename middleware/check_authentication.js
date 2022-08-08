const jwt = require('jsonwebtoken');

//Verficar que la session este activa recuperando los datos del objeto userIdentification 
module.exports= (req, res, next) => {
    try {
        const token = req.session.userIdentification.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded; 
        next();
    } catch (error) {
        return res.render('error', { message: "Error al verificar la sessión", error: error.message});
    }
}