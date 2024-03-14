const express = require("express");
const mongoose = require('mongoose');
const bookRoute = require('./routes/book');
const cors = require ('cors');
const userRoute = require('./routes/user');
const path = require('path');
const app = express();

/** securisation : configuration des en-têtes HTTP, la protection contre les attaques XSS, la désactivation de la mise en cache côté client, etc. **/
const helmet = require('helmet');

/**** création d'une couche de securité 
require('dotenv').config();*/

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect( process.env.DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


  // Utilisez le middleware Helmet avec la politique de ressource cross-origin appropriée
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use(cors())
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/books', bookRoute);
app.use('/api/auth', userRoute);

app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});





module.exports = app;