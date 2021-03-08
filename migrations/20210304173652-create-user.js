'use strict';
const User = require("../model/User")
const {Op} = require("sequelize")

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'user',
      "createdAt",
      {
        type : Sequelize.DataTypes.NOW,
        defaultValue: Sequelize.DataTypes.DATE,
        allowNull: false
      }
    )
    queryInterface.addColumn(
      'user',
      "updatedAt",
      {
        type : Sequelize.DataTypes.NOW,
        defaultValue: Sequelize.DataTypes.DATE,
        allowNull: false
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'user',
      'createdAt'
    )
    queryInterface.removeColumn(
      'user',
      'updatedAt'
    )
  }
};


// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//    await userdb.update({
//      createdAt : Sequelize.literal('CURRENT_TIMESTAMP'),
//      updatedAt : Sequelize.literal('CURRENT_TIMESTAMP')
//    },{
//      where:{
//        [Op.or]:[
//          { 
//            createdAt:{
//            [Op.is]:null
//          }
//          },
//          { 
//            updatedAt : {
//              [Op.is]:null
//            } 
//           }
//        ]
//      }
//    })
//   },

//   down: async (queryInterface, Sequelize) => {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//   }
// };