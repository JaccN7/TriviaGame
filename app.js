const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

//Importar rutas
const playerScoreRoutes = require('./routes/api/playerScoreRoutes');
const playerScoreWebRoutes = require('./routes/web/playerScoreWebRoutes');
const triviaQuestionRoutes = require('./routes/api/triviaQuestionRoutes');
const triviaQuestionWebRoutes = require('./routes/web/triviaQuestionWebRoutes');
const userRoutes = require('./routes/api/userRoutes');
const userWebRoutes = require('./routes/web/userWebRoutes');
const errorRoutes = require('./routes/web/errorRoutes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: process.env.SECRET_KEY, resave: true, saveUninitialized: true}));
app.use(cors());

// Contenido estatico de la aplicación
app.use('/public', express.static(path.join(__dirname, './public')));

//Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//Rutas API
app.use('/api', playerScoreRoutes.routes); //corregirr: la vista principal se renderiza desde aqui
app.use('/api', triviaQuestionRoutes.routes);
app.use('/api', userRoutes.routes);

//Rutas Web
app.use('/', playerScoreWebRoutes.routes);
app.use('/web', triviaQuestionWebRoutes.routes);
app.use('/web', userWebRoutes.routes);
app.use('/', errorRoutes.routes);

app.listen(PORT, () => {
    console.log(`Visita: http://localhost:${PORT}\n______________________________________________\n\n`);
});