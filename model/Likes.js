const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('postgres://twitter:1234@localhost/twitter')

const likes = sequelize.define('likes', {
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey: true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    entity_type:{
        type:DataTypes.ENUM(['tweet', 'comment']),
        allowNull:false
    },
    entity_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    like_type:{
        type:DataTypes.ENUM(['like', 'love', 'happy', 'sad', 'curious']),
        allowNull:false
    }
}, {
    freezeTableName:true,
    timestamps:true
})

likes.sync()
module.exports = likes