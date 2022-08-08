const express = require("express");
const router = express.Router();

const { getPlayerScore, addPlayerScore } = require("../../controllers/playerScoreController");

//Ruta para cargar tabla con puntajes
router.get('/', getPlayerScore);

//Ruta para ingresar nuevos puntajes
router.post('/web/finishedtrivia', addPlayerScore);

module.exports = {
    routes: router
};