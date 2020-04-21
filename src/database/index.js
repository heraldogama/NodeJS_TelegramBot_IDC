const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const Cid = require('../models/Subcat');
const connection = new Sequelize(dbConfig);
Cid.init(connection);
module.exports = connection;