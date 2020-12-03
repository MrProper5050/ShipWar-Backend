const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('shipwar','root','147Stive',{
    host:'localhost',
    dialect:'mysql'
   
})

module.exports = sequelize