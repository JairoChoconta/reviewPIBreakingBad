const { DataTypes } = require('sequelize');
// Exportamos una función que define el modelo
// Luego le inyectamos la conexión a sequelize.
module.exports = (sequelize) => {
    //defino el modelo
    sequelize.define('occupation', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
}