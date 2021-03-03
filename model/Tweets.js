const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://twitter:1234@localhost/twitter')

const likes = require("./Likes")
const comment = require("./Comments")

const tweets = sequelize.define('tweets', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey:true
    },
    uid:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tweet:{
        type:DataTypes.STRING
    }

}, {
    freezeTableName: true,
    updatedAt:false,
    timestamps:true
})

//tweet - comment (1:n relation)
tweets.hasMany(comment,{
    foreignKey: "tid",
    onDelete : "cascade"
});
comment.belongsTo(tweets,{
    foreignKey:"tid"
})

//tweet - likes (1:n)
tweets.hasMany(likes, {
    foreignKey : "entity_id",
    onDelete:"cascade"
})
likes.belongsTo(tweets, {
    foreignKey : "entity_id"
})

tweets.sync()
module.exports = tweets