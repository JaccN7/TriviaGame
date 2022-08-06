const express = require("express");
const router = express.Router();

const { getPlayerScore } = require("../../controllers/playerScoreController");

//Ruta para cargar tabla con puntajes
router.get('/', getPlayerScore);

//Ruta para ingresar nuevos puntajes

module.exports = {
    routes: router
};