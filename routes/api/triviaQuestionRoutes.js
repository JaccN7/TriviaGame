const express = require('express');
const router = express.Router();

const { getGenerateGame, getTriviaQuestion, searchTriviaQuestion, createTriviaQuestion, updateTriviaQuestion, deleteTriviaQuestion, pageUpdateTriviaQuestion } = require('../../controllers/triviaQuestionController');

//Ruta para generar el juego - Para testeo con Postman de las preguntas random sin repetir
router.get('/generategame', getGenerateGame);

//Ruta para mostrar todas las preguntas - Para testeo con Postman
router.get('/triviaquestions', getTriviaQuestion);

//Ruta para buscar una pregunta por su id - Probada y funcionando con Postman - Se utiliza para buscar el id y cargar página para el modificar
router.get('/triviaquestion/:id', searchTriviaQuestion);

//Ruta para añadir nuevas preguntas (cargar un formulario) - Probada y funcionando con Postman - Pendiente
router.post('/triviaquestion', createTriviaQuestion);

//Ruta para modificar preguntas (Mostrar los datos de la pregunta a modificar y permitir editarla) - Probada y funcionando con Postman
router.put('/triviaquestion/:id', updateTriviaQuestion);

//Ruta para eliminar preguntas (Eliminar una pregunta) - Probada y funcionando con Postman - Se consume la ruta al hacer click en el botón eliminar de la vista
router.delete('/triviaquestion/:id', deleteTriviaQuestion);

module.exports = {
    routes: router
};