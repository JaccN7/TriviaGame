const jwt = require('jsonwebtoken');

module.exports= (req, res, next) => {
    let userName, userType;
    req.session.userIdentification ? userName = req.session.userIdentification.userName : userName = "Anónimo";
    req.session.userIdentification ? userType = req.session.userIdentification.userType : userType = "Invitado";
    try {
        const token = req.session.userIdentification.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded; 
        next();
    } catch (error) {
        return res.render('error', { message: "Error al verificar la sessión", error: error.message, userName: userName, userType: userType });
    }
}