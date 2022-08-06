const express = require('express');
const app = express();
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
app.use(cors());

// Contenido estatico de la aplicación
app.use('/public', express.static(path.join(__dirname, './public')));

//Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//Rutas API
app.use('/', playerScoreRoutes.routes);
app.use('/api/game', triviaQuestionRoutes.routes);
app.use('/api/adminprofile', userRoutes.routes);

//Rutas Web
app.use('/web/game', triviaQuestionWebRoutes.routes);
app.use('/', errorRoutes.routes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}\nVisita: http://localhost:${PORT}\n______________________________________________\n\n`);
});