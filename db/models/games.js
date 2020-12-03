const Sequelize = require('sequelize')
const sequelize = require('../connect')


const Games = sequelize.define('Games',{
    id:{
        type: Sequelize.STRING(11),
        primaryKey: true,
        allowNull: false
            
    },
    gameName:{
        type: Sequelize.STRING(11),
        allowNull:false
    },
    owner_id_name:{
        type:Sequelize.JSON,
        allowNull:false,
    },
    players:{
        type: Sequelize.JSON,
        allowNull:false,
        defaultValue:[]
    },
    result:{
        type:Sequelize.JSON,
        defaultValue:[]
    }

})

module.exports = Games