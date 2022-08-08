const express = require("express");
const router = express.Router();

const { getPlayerScore } = require("../../controllers/playerScoreController");

//Ruta para ver puntajes de los jugadores
router.get('/', getPlayerScore);

module.exports = {
    routes: router
};