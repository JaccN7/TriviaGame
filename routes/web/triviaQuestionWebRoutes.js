const express = require('express');
const router = express.Router();

const { getGenerateGame, getTriviaQuestion, searchTriviaQuestion, updateTriviaQuestion, createTriviaQuestion, deleteTriviaQuestion, pageUpdateTriviaQuestion, pageCreateTriviaQuestion} = require('../../controllers/triviaQuestionController');
const checkAuthentication = require('../../middleware/check_authentication');
const checkAuthorization = require('../../middleware/check_authorization');

//Ruta para generar el juego (Cargar tarjetas con 3 preguntas random) - Renderizado en la vista - Funcionando
router.get('/generategame', getGenerateGame);

//Ruta para mostrar todas las preguntas - Renderizado en la vista - Funcionando
router.get('/triviaquestions', checkAuthentication, checkAuthorization, getTriviaQuestion);

//Ruta para buscar una pregunta por su id 
//router.get('/triviaquestion/:id', searchTriviaQuestion);

//Rutas para añadir preguntas
//Ruta para renderizar formulario para añadir una pregunta - Renderizado en la vista - Funcionando
router.get('/formnewtriviaquestion', checkAuthentication, checkAuthorization, pageCreateTriviaQuestion);
//Ruta para guardar la pregunta en la base de datos - Funcionando
router.post('/newtriviaquestion', checkAuthentication, checkAuthorization,  createTriviaQuestion); 

//Rutas para modificar preguntas
//Ruta para renderizar formulario para modificar una pregunta - Renderizado en la vista - Funcionando
router.get('/formupdtriviaquestion/:id', pageUpdateTriviaQuestion);
//Ruta para modificar la pregunta en la base de datos - Funcionando
router.post('/updatetriviaquestion', updateTriviaQuestion);

//Ruta para eliminar una pregunta - Funcionando
router.get('/deletetriviaquestion/:id', deleteTriviaQuestion);

module.exports = {
    routes: router
};