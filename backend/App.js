const express = require("express");
const mongoose = require('mongoose');
const bookRoute = require('./routes/book');
const cors = require ('cors');
const userRoute = require('./routes/user');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect('mongodb+srv://Tayari:czrYiSAovhBa2zpl@atlascluster.i8q6mst.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(cors())
app.use(express.json());
app.use('/api/books', bookRoute);
app.use('/api/auth', userRoute);

app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});





module.exports = app;