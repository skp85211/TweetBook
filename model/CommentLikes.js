const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('postgres://twitter:1234@localhost/twitter')

const commentLikes = sequelize.define('commentLikes', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true
})

commentLikes.sync()
module.exports = commentLikes