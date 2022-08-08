const express = require('express');
const router = express.Router();

const { getGenerateGame, getTriviaQuestion, searchTriviaQuestion, createTriviaQuestion, updateTriviaQuestion, deleteTriviaQuestion, pageUpdateTriviaQuestion } = require('../../controllers/triviaQuestionController');

//Ruta para generar el juego - Para testeo con Postman de las preguntas random sin repetir - Funcionando
router.get('/generategame', getGenerateGame);

//Ruta para mostrar todas las preguntas - Para testeo con Postman - Funcionando
router.get('/triviaquestions', getTriviaQuestion);

//Ruta para buscar una pregunta por su id - Para testeo con Postman - Funcionando
router.get('/triviaquestion/:id', searchTriviaQuestion);

//Ruta para añadir nuevas preguntas - Para testeo con Postman - Funcionando
router.post('/triviaquestion', createTriviaQuestion);

//Ruta para modificar preguntas - Para testeo con Postman
//router.put('/triviaquestion/:id', updateTriviaQuestion);

//Ruta para eliminar una pregunta - Para testeo con Postman - Funcionando
router.delete('/triviaquestion/:id', deleteTriviaQuestion);

module.exports = {
    routes: router
};