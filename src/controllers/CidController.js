const Cid = require('../models/Subcat');
const {
    Op
} = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({
    path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env"
});
module.exports = {
    async index(req, res) {
        try {
            const desCid = req.body.description;
            // const desCid = req.query.description;
            const cids = await Cid.findAll({
                attributes: ['subcat', 'descricao'],
                where: {
                    descricao: {
                        [Op.iLike]: '%' + desCid + '%'
                    }
                },
            });
            console.log(`Array com ${cids.length} elementos.`)
            return (res.json(cids));
        } catch (error) {
            res.json({
                "Falha ao processar sua requisição.": error
            });
        }
    },
};