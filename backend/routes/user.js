const express = require('express');
const routeur = express.Router();
const userControllers = require('../controllers/user');


routeur.post("/signup", userControllers.signup);
routeur.post("/login", userControllers.login);


module.exports = routeur;