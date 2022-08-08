const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    const error = new Error('No encontrado');
    error.status = 404;
    next(error);
});

router.use((error, req, res, next) => {
    res.status(error.status || 500).render("error", { message: error.message, error: error.message });
});

module.exports = {
    routes: router
};