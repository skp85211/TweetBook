'use strict';
const userdb = require("../model/User")
const {Op} = require("sequelize")

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await userdb.update({
     createdAt : Sequelize.literal('CURRENT_TIMESTAMP'),
     updatedAt : Sequelize.literal('CURRENT_TIMESTAMP')
   },{
     where:{
       [Op.or]:[
         { 
           createdAt:{
           [Op.is]:null
         }
         },
         { 
           updatedAt : {
             [Op.is]:null
           } 
          }
       ]
     }
   })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
