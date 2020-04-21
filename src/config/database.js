/**
 * Aqui eu recebo os parametros de conexão com o DB baseados nas
 * informações do .ENV (onde estão os valores das variáveis de ambiente)
 */
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
        // habilitar o uso do UNDERLINE no formato de nome das colulas (user_group) 22:30
        underscored: true,
    },
};