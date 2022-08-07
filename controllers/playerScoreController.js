const { response } = require('express');
const firebase = require('../config/conexionDB');
const PlayerScore = require('../models/PlayerScore');
const fireStore = firebase.firestore();

//Cargar todos los puntajes
const getPlayerScore = async (req, res, next) => {
    console.log("### Método getPlayerScore ###");
    try {
        const playerScore = await fireStore.collection('playerScore');
        const playerScoreData = await playerScore.get();

        const playerScoreArray = [];

        if (playerScoreData.empty) {
            res.render('index', { message: "No hay puntajes registrados", playerScoreArray });
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
            res.render('index', { playerScoreArray });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al cargar los puntajes", error: error.message });
    }
}


//Crear un nuevo puntaje (Cuando se termina un juego)
const addPlayerScore = async (req, res, next) => {
    console.log("### Método getPlayerScore ###");
    try {
        const playerScore = req.body;
        const idQuestions = playerScore.id; //ID de las preguntas aleatorias
        const answerObtained = [playerScore.question1answers, playerScore.question2answers, playerScore.question3answers];
        let score = 0;
        let porcentage = 0;
        let date = new Date();
        date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        console.log(date);
        //Comparar la answer 5 (respuesta correcta) con las respuesta del juego
        for (let i = 0; i < idQuestions.length; i++) {
            const triviaQuestion = await fireStore.collection('triviaQuestion').doc(idQuestions[i]).get();
            if (triviaQuestion.data().answer5 === answerObtained[i]) {
                score++;
            }
        }
        console.log(score);
        porcentage = (score * 100) / idQuestions.length;
        porcentage = Math.round(porcentage * 10) / 10;
        console.log(porcentage);

        //objeto con los datos del nuevo puntaje
        const newPlayerScore = ({
            name: 'playerScore.name',
            score: score,
            porcentage: porcentage,
            date: date
        })
        console.log(newPlayerScore);
        //insertar el nuevo puntaje en la base de datos
        const playerScoreData = await fireStore.collection('playerScore').add(newPlayerScore);
        console.log(playerScoreData);
        if(req.originalUrl.includes("web")){
            res.redirect('/');
        }else{
            res.status(201).json({ message: "Puntaje registrado", playerScoreData });
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

module.exports = {
    getPlayerScore,
    addPlayerScore
}