const express = require('express');
const CidController = require('./controllers/CidController');
const routes = express.Router();

routes.get('/', CidController.index);

module.exports = routes;