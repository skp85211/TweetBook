const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('postgres://twitter:1234@localhost/twitter')

const tweetLikes = sequelize.define('tweetLikes', {
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
    tweet_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
}, {
        freezeTableName:true,
        timestamps:true
})

tweetLikes.sync()
module.exports = tweetLikes