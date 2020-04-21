const {
    Model,
    DataTypes
} = require('sequelize');

class Subcat extends Model {
    static init(sequelize) {
        super.init({
            subcat: DataTypes.STRING,
            descricao: DataTypes.STRING,
        }, {
            sequelize,
            tableName: 'cid10subcat'
        })
    }
}

module.exports = Subcat;