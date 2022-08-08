const express = require('express');
const firebase = require('../config/conexionDB');
const TriviaQuestion = require('../models/TriviaQuestion');
const fireStore = firebase.firestore();

//Generar un juego con preguntas aleatorias
const getGenerateGame = async (req, res, next) => {
    //Recuperar nombre de usuario
    let userName, userType;
    req.session.userIdentification ? userName = req.session.userIdentification.userName : userName = "Anónimo";
    req.session.userIdentification ? userType = req.session.userIdentification.userType : userType = "Invitado";
    try {
        const triviaQuestion = fireStore.collection('triviaQuestion');
        const triviaQuestionData = await triviaQuestion.get();
        const randomTriviaQuestion = [];
        //Seleccionar 3 preguntas aleatorias, 
        while (randomTriviaQuestion.length < 3) {
            //Seleccionar ID aleatorio
            const randomId = triviaQuestionData.docs[Math.floor(Math.random() * triviaQuestionData.size)].id;
            //Verificar que no se repitan las preguntas
            if (randomTriviaQuestion.find(obj => obj.id === randomId) === undefined) {
                //Obtener los datos de la pregunta y respuestas asociadas a ese id
                const randomTriviaQuestionData = await triviaQuestion.doc(randomId).get();
                //Crear un objeto de la clase TriviaQuestion con los datos de la pregunta y respuestas
                const randomTriviaQuestionObject = new TriviaQuestion(
                    randomTriviaQuestionData.id,
                    randomTriviaQuestionData.data().question,
                    randomTriviaQuestionData.data().answer1 ? randomTriviaQuestionData.data().answer1 : "",
                    randomTriviaQuestionData.data().answer2 ? randomTriviaQuestionData.data().answer2 : "",
                    randomTriviaQuestionData.data().answer3 ? randomTriviaQuestionData.data().answer3 : "",
                    randomTriviaQuestionData.data().answer4 ? randomTriviaQuestionData.data().answer4 : "",
                    randomTriviaQuestionData.data().answer5 ? randomTriviaQuestionData.data().answer5 : ""
                );
                //Agregar el objeto a un array de objetos
                randomTriviaQuestion.push(randomTriviaQuestionObject);
            }
        }

        //Comprobar el origen de la petición
        req.originalUrl.includes("web") ?
            res.render('triviaGame', { randomTriviaQuestion: randomTriviaQuestion, userName: userName, userType: userType }) :
            res.status(200).json({ message: "Juego generado", randomTriviaQuestion: randomTriviaQuestion });
    } catch (error) {
        //Comprobar el orgigen de la petición
        req.originalUrl.includes("web") ?
            res.render('error', { message: "Error al generar juego", error: error.message, userName: userName, userType: userType }) :
            res.status(500).json({ message: "Error al generar juego", error: error.message });
    }
}

//Cargar todas las preguntas
const getTriviaQuestion = async (req, res, next) => {
    //Recuperar nombre de usuario
    let userName, userType;
    req.session.userIdentification ? userName = req.session.userIdentification.userName : userName = "Anónimo";
    req.session.userIdentification ? userType = req.session.userIdentification.userType : userType = "Invitado";
    try {
        const triviaQuestion = await fireStore.collection('triviaQuestion').get();
        //Comprobar si hay preguntas registradas
        if (triviaQuestion.empty) {
            return res.status(404).json({ message: "No hay preguntas" });
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
        req.originalUrl.includes("web") ?
            res.render('adminWatchTriviaQuestions', { message: "Registro preguntas", triviaQuestionArray: triviaQuestionArray, cantidadPreguntas: count, userName: userName, userType: userType }) :
            res.status(200).json({ message: "Registro preguntas", triviaQuestionArray: triviaQuestionArray, cantidadPreguntas: count });
    } catch (error) {
        req.originalUrl.includes("web") ?
            res.render('error', { message: "Error al cargar preguntas", error: error.message, userName: userName, userType: userType }) :
            res.status(500).json({ message: "Se ha presentado un error", error: error.message });
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
        req.originalUrl.includes("web") ?
            res.render('error') :
            res.status(500).json({ message: "Se ha presentado un error", error: error.message });
    }
}

//Crear una nueva pregunta para la trivia
const createTriviaQuestion = async (req, res, next) => {
    let userName, userType;
    req.session.userIdentification ? userName = req.session.userIdentification.userName : userName = "Anónimo";
    req.session.userIdentification ? userType = req.session.userIdentification.userType : userType = "Invitado";
    try {
        const triviaQuestion = req.body;
        const newTriviaQuestion = fireStore.collection('triviaQuestion').doc().set(triviaQuestion);

        req.originalUrl.includes("web") ?
            res.redirect('/web/triviaquestions') :
            res.status(201).json({ message: "Pregunta creada correctamente", triviaQuestion: triviaQuestion });
    } catch (error) {
        req.originalUrl.includes("web") ?
            res.render('error', { message: "Error al crear pregunta", error: error.message, userName: userName, userType: userType }) :
            res.status(500).json({ message: "Se ha presentado un error", error: error.message });
    }
}

//Actualizar una pregunta de la trivia
const updateTriviaQuestion = async (req, res, next) => {
    let userName, userType;
    req.session.userIdentification ? userName = req.session.userIdentification.userName : userName = "Anónimo";
    req.session.userIdentification ? userType = req.session.userIdentification.userType : userType = "Invitado";
    try {
        const triviaQuestion = req.body;
        const updateTriviaQuestion = await fireStore.collection('triviaQuestion').doc(triviaQuestion.id).update(triviaQuestion);
        res.redirect('/web/triviaquestions');
    } catch (error) {
        res.render('error', { message: "Se ha presentado un error", error: error.message, userName: userName, userType: userType });
    }
}

//Eliminar una pregunta de la trivia
const deleteTriviaQuestion = async (req, res, next) => {
    let userName, userType;
    req.session.userIdentification ? userName = req.session.userIdentification.userName : userName = "Anónimo";
    req.session.userIdentification ? userType = req.session.userIdentification.userType : userType = "Invitado";
    try {
        const id = req.params.id;
        const deleteTriviaQuestion = await fireStore.collection('triviaQuestion').doc(id).delete();
        req.originalUrl.includes("web") ?
            res.redirect('/web/triviaQuestions') :
            res.status(200).json({ message: "Pregunta eliminada correctamente" })
    } catch (error) {
        req.originalUrl.includes("web") ?
            res.render('error', { message: "Error al eliminar pregunta", error: error.message, userName: userName, userType: userType }) :
            res.status(500).json({ message: "Se ha presentado un error", error: error.message });
    }
}

//Renderizar páginas
//Página para crear una nueva pregunta
const pageCreateTriviaQuestion = (req, res, next) => {
    let userName, userType;
    req.session.userIdentification ? userName = req.session.userIdentification.userName : userName = "Anónimo";
    req.session.userIdentification ? userType = req.session.userIdentification.userType : userType = "Invitado";
    res.render('adminNewTriviaQuestion', { message: "Crear pregunta", userName: userName, userType: userType });
}

//Página para editar una pregunta
const pageUpdateTriviaQuestion = async (req, res, next) => {
    let userName, userType;
    req.session.userIdentification ? userName = req.session.userIdentification.userName : userName = "Anónimo";
    req.session.userIdentification ? userType = req.session.userIdentification.userType : userType = "Invitado";
    try {
        //Recuperar el id de la pregunta a editar
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
        objModifiedQuestion.id ?
            res.render('adminUpdateTriviaQuestion', { message: "Actualizar pregunta", objModifiedQuestion: objModifiedQuestion, userName: userName, userType: userType }) :
            res.render('error', { message: "Pregunta no encontrada", userName: userName, userType: userType });
    } catch (error) {
        req.originalUrl.includes("web") ?
            res.render('error', { message: "Error al actualizar pregunta", error: error.message, userName: userName }) :
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