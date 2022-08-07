const { response } = require('express');
const firebase = require('../config/conexionDB');
const User = require('../models/User');
const fireStore = firebase.firestore();



module.exports = {
    getPlayerScore
}