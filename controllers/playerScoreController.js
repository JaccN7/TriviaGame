const { response } = require('express');
const firebase = require('../config/conexionDB');
const PlayerScore = require('../models/PlayerScore');
const fireStore = firebase.firestore();

//Cargar todos los puntajes
const getPlayerScore = async (req, res, next) => {
    let userName, userType, userStatus;
    req.session.userIdentification ? userName = req.session.userIdentification.userName : userName = "Anónimo";
    req.session.userIdentification ? userType = req.session.userIdentification.userType : userType = "Invitado";
    req.session.userIdentification ? userStatus = req.session.userIdentification.userStatus : userStatus = "";
    try {
        const playerScore = await fireStore.collection('playerScore');
        const playerScoreData = await playerScore.get();

        const playerScoreArray = [];

        //Comprobar si hay puntajes registrados
        if (playerScoreData.empty) {
            res.render('index', { message: "No hay puntajes registrados", playerScoreArray, userName, userType, userStatus });
        } else {
            playerScoreData.forEach(doc => {
                const playerScore = new PlayerScore(
                    doc.id,
                    doc.data().name,
                    doc.data().score,
                    doc.data().porcentage,
                    doc.data().date
                );
                playerScoreArray.push(playerScore);
            });
            //Ordenar los score de mayor a menor
            playerScoreArray.sort(function (a, b) {
                return b.score - a.score;
            });
            //Comprobar el origen de la petición operador ternario solo if sin else
            if(req.originalUrl.includes("api")) return res.status(200).json({ message: "Puntajes obtenidos", playerScoreArray });
            res.render('index', { message: "Puntajes registrados", playerScoreArray: playerScoreArray, userName: userName, userType: userType, userStatus: userStatus });
        }
    } catch (error) {
        res.render('error', { message: "Error al obtener los puntajes", error: error.message, userName, userType, userStatus });
    }
}

//Crear un nuevo puntaje (Cuando se termina un juego)
const addPlayerScore = async (req, res, next) => {
    console.log("### Método addPlayerScore ###");
    let userName, userType, userStatus;
    req.session.userIdentification ? userName = req.session.userIdentification.userName : userName = "Anónimo";
    req.session.userIdentification ? userType = req.session.userIdentification.userType : userType = "Invitado";
    req.session.userIdentification ? userStatus = req.session.userIdentification.userStatus : userStatus = "";
    try {
        const playerScore = req.body;

        const idQuestions = playerScore.id; //ID de las preguntas aleatorias
        const answerObtained = [playerScore.question1answers, playerScore.question2answers, playerScore.question3answers]; //Respuestas ingresadas por el jugador
        let score = 0;
        let porcentage = 0;
        let date = new Date();
        date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(); //Fecha actual (dd/mm/yyyy)
        //Comparar la respuesta correcta (answer5) con las respuesta ingresadas por el jugador
        for (let i = 0; i < idQuestions.length; i++) {
            const triviaQuestion = await fireStore.collection('triviaQuestion').doc(idQuestions[i]).get();
            if (triviaQuestion.data().answer5 === answerObtained[i]) {
                score++;
            }
        }
        porcentage = (score * 100) / idQuestions.length;
        porcentage = Math.round(porcentage * 10) / 10; //Redondear el porcentaje a un decimal

        //Objeto con los datos del nuevo puntaje
        const newPlayerScore = ({
            name: userName,
            score: score,
            porcentage: porcentage,
            date: date
        });

        //Guardar el puntaje en la BD
        const playerScoreData = await fireStore.collection('playerScore').add(newPlayerScore);

        //Comprobar el origen de la petición
        req.originalUrl.includes("web") ?
            res.redirect('/') :
            res.status(201).json({ message: "Puntaje registrado", playerScoreData });

    } catch (error) {
        //Comprobar el origen de la petición
        req.originalUrl.includes("web") ?
            res.render('error', { message: "Error al obtener los puntajes", error: error.message, userName, userType, userStatus }) :
            res.status(500).json({ message: "Se ha presentado un error", error: error.message });
    }
}

module.exports = {
    getPlayerScore,
    addPlayerScore
}