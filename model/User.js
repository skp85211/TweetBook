const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://twitter:1234@localhost/twitter')


const tweet = require("./Tweets")
const comment = require("./Comments")
const likes = require("./Likes")

const user = sequelize.define('user', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING,
        unique:true
    },
    password:{
        type:DataTypes.STRING
    }

}, {
    freezeTableName: true,
    createdAt:false,
    timestamps:false
})

//user - tweet (1:n relation)
user.hasMany(tweet, {
    foreignKey: "uid",
    onDelete: "cascade"
});
tweet.belongsTo(user, {
    foreignKey: "uid"
})

//user - comment (1:n relation)*
user.hasMany(comment, {
    foreignKey:"uid",
    onDelete:"cascade"
})
comment.belongsTo(user, {
    foreignKey:"uid"
})

//user - likes (1:n)
user.hasMany(likes, {
    foreignKey:"user_id",
    onDelete : "cascade"
})
likes.belongsTo(user, {
    foreignKey:"user_id"
})

user.sync()
module.exports = user