const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('postgres://twitter:1234@localhost/twitter')
const likes = require("../model/Likes")

const comments = sequelize.define('comments', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    tid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    comment: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
})

//comment - likes (1:n)
comments.hasMany(likes, {
    as:"likes",
    sourceKey:"id",
    foreignKey:"entity_id",
    onDelete : "cascade"
})
likes.belongsTo(comments, {
    as:"comments",
    sourceKey:"id",
    foreignKey:"entity_id"
})

comments.sync()
module.exports = comments