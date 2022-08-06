const express = require('express');
const firebase = require('../config/conexionDB');
const TriviaQuestion = require('../models/TriviaQuestion');
const fireStore = firebase.firestore();

//Generar un juego con preguntas aleatorias
const getGenerateGame = async (req, res, next) => {
    console.log("### Método getGenerateGame ###");
    try {
        const triviaQuestion = fireStore.collection('triviaQuestion');
        const triviaQuestionData = await triviaQuestion.get();
        const randomTriviaQuestion = [];
        while (randomTriviaQuestion.length < 3) {
            const randomId = triviaQuestionData.docs[Math.floor(Math.random() * triviaQuestionData.size)].id;
            //Verificación: No para no repetir la pregunta
            if (randomTriviaQuestion.find(obj => obj.id === randomId) === undefined) {
                //obtiene los datos de la pregunta y respuestas asociadas a ese id y crea un objeto
                const randomTriviaQuestionData = await triviaQuestion.doc(randomId).get();
                const randomTriviaQuestionObject = new TriviaQuestion(
                    randomTriviaQuestionData.id,
                    randomTriviaQuestionData.data().question,
                    randomTriviaQuestionData.data().answer1 ? randomTriviaQuestionData.data().answer1 : "",
                    randomTriviaQuestionData.data().answer2 ? randomTriviaQuestionData.data().answer2 : "",
                    randomTriviaQuestionData.data().answer3 ? randomTriviaQuestionData.data().answer3 : "",
                    randomTriviaQuestionData.data().answer4 ? randomTriviaQuestionData.data().answer4 : "",
                    randomTriviaQuestionData.data().answer5 ? randomTriviaQuestionData.data().answer5 : ""
                );
                randomTriviaQuestion.push(randomTriviaQuestionObject);
            }
        }
        res.render('triviaGame', { randomTriviaQuestion });
    } catch (error) {
        controlError(error, res, req);
        //res.status(500).json({message: "Error al generar el juego", error: error.message});
    }
}

//Mostrar todas las preguntas
const getTriviaQuestion = async (req, res, next) => {
    console.log("### Método getTriviaQuestion ###");
    try {
        const triviaQuestion = await fireStore.collection('triviaQuestion').get();
        if (triviaQuestion.empty) {
            res.status(404).json({ message: "No hay preguntas" });
        };
        const triviaQuestionArray = [];
        let count = 0;
        triviaQuestion.forEach(doc => {
            const triviaQuestion = new TriviaQuestion(
                doc.id,
                doc.data().question,
                doc.data().answer1 ? doc.data().answer1 : "",
                doc.data().answer2 ? doc.data().answer2 : "",
                doc.data().answer3 ? doc.data().answer3 : "",
                doc.data().answer4 ? doc.data().answer4 : "",
                doc.data().answer5 ? doc.data().answer5 : ""
            );
            triviaQuestionArray.push(triviaQuestion);
            count++;
        });
        //si la ruta desde la que accede es web/ entoces renderizar view y la ruta desde la que accede es api/ entonces devolver un json
        if (req.originalUrl.includes("web")) {
            res.render('adminWatchTriviaQuestions', { message: "Registro preguntas", triviaQuestionArray: triviaQuestionArray, cantidadPreguntas: count });
        }
        if (req.originalUrl.includes("api")) {
            res.status(200).json({ message: "Registro preguntas", triviaQuestionArray: triviaQuestionArray, cantidadPreguntas: count });
        }

    } catch (error) {
        if (req.originalUrl.includes("web")) {
            res.render('error');
        }
        if (req.originalUrl.includes("api")) {
            res.status(500).json({ message: "Se ha presentado un error", error: error.message });
        }
    }
}

//Buscar una pregunta por su id
const searchTriviaQuestion = async (req, res, next) => {
    console.log("### método searchTriviaQuestion ###");
    try {
        const id = req.params.id;
        const triviaQuestion = await fireStore.collection('triviaQuestion').doc(id).get();
        const triviaQuestionData = await triviaQuestion.data();
        if (triviaQuestionData) {
            res.status(200).json({ message: "Pregunta encontrada", triviaQuestionData: triviaQuestionData });
        } else {
            res.status(404).json({ message: "Pregunta no encontrada" });
        }
    } catch (error) {
        if (req.originalUrl.includes("web")) {
            res.render('error');
        }
        if (req.originalUrl.includes("api")) {
            res.status(500).json({ message: "Se ha presentado un error", error: error.message });
        }
    }
}


//Crear una nueva pregunta para la trivia
const createTriviaQuestion = async (req, res, next) => {
    console.log("### Método createTriviaQuestion ###");
    try {
        const triviaQuestion = req.body;
        console.log(triviaQuestion);
        const newTriviaQuestion = fireStore.collection('triviaQuestion').doc().set(triviaQuestion);

        if (req.originalUrl.includes("web")) {
            res.redirect('/web/game/triviaquestions');
        }
        if (req.originalUrl.includes("api")) {
            res.status(201).json({ message: "Pregunta creada correctamente", triviaQuestion: triviaQuestion });
        }
    } catch (error) {
        if (req.originalUrl.includes("web")) {
            res.render('error');
        }
        if (req.originalUrl.includes("api")) {
            res.status(500).json({ message: "Se ha presentado un error", error: error.message });
        }
    }
}

//Actualizar una pregunta de la trivia
const updateTriviaQuestion = async (req, res, next) => {
    console.log("### =>>Método updateTriviaQuestion <<= ###");
    try {
        const triviaQuestion = req.body;
        console.log("el resultado de trivia question es: " + triviaQuestion);
        console.log("el id es: " + triviaQuestion.id);
        const updateTriviaQuestion = await fireStore.collection('triviaQuestion').doc(triviaQuestion.id).update(triviaQuestion);
        console.log(updateTriviaQuestion);
        if (req.originalUrl.includes("web")) {
            res.redirect('/web/game/triviaquestions');
        }
        if (req.originalUrl.includes("api")) {
            res.status(200).json({ message: "Pregunta actualizada correctamente", triviaQuestion: triviaQuestion });
        }
    } catch (error) {
        if (req.originalUrl.includes("web")) {
            res.render('error');
        }
        if (req.originalUrl.includes("api")) {
            res.status(500).json({ message: "Se ha presentado un error", error: error.message });
        }
    }
}

//Eliminar una pregunta de la trivia
const deleteTriviaQuestion = async (req, res, next) => {
    console.log("### Método deleteTriviaQuestion ###");
    try {
        const id = req.params.id;
        console.log("id: " + id);
        const deleteTriviaQuestion = await fireStore.collection('triviaQuestion').doc(id).delete();
        if (req.originalUrl.includes("web")) {
            res.redirect('/web/game/triviaQuestions');
        }
        if (req.originalUrl.includes("api")) {
            res.status(200).json({ message: "Pregunta eliminada correctamente" });
        }
    } catch (error) {
        if (req.originalUrl.includes("web")) {
            res.render('error');
        }
        if (req.originalUrl.includes("api")) {
            res.status(500).json({ message: "Se ha presentado un error", error: error.message });
        }
    }
}

//Renderizar páginas
//Página para crear una nueva pregunta
const pageCreateTriviaQuestion = (req, res, next) => {
    console.log("### Método pageCreateTriviaQuestion ###");
    res.render('adminNewTriviaQuestion');
}

//Página para editar una pregunta
const pageUpdateTriviaQuestion = async (req, res, next) => {
    console.log("### Método pageUpdateTriviaQuestion ###");
    //res.render('adminUpdateTriviaQuestion');
    try {
        const id = req.params.id;
        const question = await fireStore.collection('triviaQuestion').doc(id);
        const updatequestion = await question.get();
        const objModifiedQuestion = new TriviaQuestion(
            updatequestion.id,
            updatequestion.data().question,
            updatequestion.data().answer1,
            updatequestion.data().answer2,
            updatequestion.data().answer3,
            updatequestion.data().answer4,
            updatequestion.data().answer5
        );
        console.log(objModifiedQuestion.id);
        if (objModifiedQuestion.id) {
            if (req.originalUrl.includes("web")) {
                res.render('adminUpdateTriviaQuestion', { message: "Actualizar pregunta", objModifiedQuestion: objModifiedQuestion });
            }
            if (req.originalUrl.includes("api")) {
                res.status(200).json({ message: "Pregunta encontrada", question: modifiedQuestion });
            }
        }
    } catch (error) {
        if (req.originalUrl.includes("web")) {
            res.render('error');
        }
        if (req.originalUrl.includes("api")) {
            res.status(500).json({ message: "Se ha presentado un error", error: error.message });
        }
    }
}

const controlError = async (req, res, error) => {
    if (req.originalUrl.includes("web")) {
        res.render('error');
    }
    if (req.originalUrl.includes("api")) {
        res.status(500).json({ message: "Se ha presentado un error", error: error.message });
    }
}

module.exports = {
    getGenerateGame,
    getTriviaQuestion,
    searchTriviaQuestion,
    createTriviaQuestion,
    updateTriviaQuestion,
    deleteTriviaQuestion,
    pageCreateTriviaQuestion,
    pageUpdateTriviaQuestion
}