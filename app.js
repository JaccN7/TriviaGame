const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
//Morgan
const morgan = require('morgan');

//Importar rutas
const playerScoreRoutes = require('./routes/playerScoreRoutes');
const triviaQuestionRoutes = require('./routes/triviaQuestionRoutes');
const userRoutes = require('./routes/userRoutes');
const errorRoutes = require('./routes/errorRoutes');

app.use(morgan('dev'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Contenido estatico de la aplicación
app.use('/public', express.static(path.join(__dirname, './public')))

//Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//Rutas
app.use('/', playerScoreRoutes.routes);
app.use('/game', triviaQuestionRoutes.routes);
app.use('/adminprofile', userRoutes.routes);
app.use('/', errorRoutes.routes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}\nVisita: http://localhost:${PORT}\n______________________________________________`);
});