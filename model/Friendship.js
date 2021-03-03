const { Sequelize, DataType, DataTypes } = require('sequelize')

const sequelize = new Sequelize('postgres://twitter:1234@localhost/twitter')

const friendship = sequelize.define('friendship', {
    id:{
        type:DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user1_id:{
        type:DataTypes.INTEGER,
        allowNull: false
    },
    user2_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    status:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    action_uid:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
}, {
    freezeTableName: true,
    timestamps:true,
    indexes: [
        {
            unique:true,
            fields: ['user1_id', 'user2_id']
        }
    ]
})

friendship.sync()
module.exports = friendship
