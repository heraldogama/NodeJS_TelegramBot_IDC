const dotenv = require('dotenv');

dotenv.config({
    path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env"
});
module.exports = {
    dialect: 'postgres',
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    define: {
        timestamps: true,
        underscored: true,
    },
};