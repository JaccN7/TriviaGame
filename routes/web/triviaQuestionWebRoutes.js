const express = require('express');
const router = express.Router();

const { getGenerateGame, getTriviaQuestion, searchTriviaQuestion, updateTriviaQuestion, createTriviaQuestion, deleteTriviaQuestion, pageUpdateTriviaQuestion, pageCreateTriviaQuestion} = require('../../controllers/triviaQuestionController');

//Ruta para generar el juego (Cargar tarjetas con 3 preguntas random) - Ya se esta renderizando en la vista
router.get('/generategame', getGenerateGame);

//Ruta para mostrar todas las preguntas - Ya se esta renderizando en la vista
router.get('/triviaquestions', getTriviaQuestion);

//Ruta para buscar una pregunta por su id - Probada y funcionando con Postman - Se utiliza para buscar el id y cargar página para el modificar
router.get('/triviaquestion/:id', searchTriviaQuestion);

//Rutas para añadir preguntas
//Ruta para renderizar formulario para añadir una pregunta
router.get('/formnewtriviaquestion', pageCreateTriviaQuestion);
//Ruta para guardar la pregunta en la base de datos
router.post('/newtriviaquestion', createTriviaQuestion);

//Rutas para modificar preguntas
//Ruta para renderizar formulario para modificar una pregunta
router.get('/formupdtriviaquestion/:id', pageUpdateTriviaQuestion);
//Ruta para modificar la pregunta en la base de datos
router.post('/updatetriviaquestion', updateTriviaQuestion);

//Ruta para eliminar preguntas (Eliminar una pregunta) - Probada y funcionando con Postman - Se consume la ruta al hacer click en el botón eliminar de la vista
router.get('/deletetriviaquestion/:id', deleteTriviaQuestion);

module.exports = {
    routes: router
};