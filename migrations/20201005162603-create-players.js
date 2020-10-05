'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Rosters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      QB: {
        type: Sequelize.STRING
      },
      RB1: {
        type: Sequelize.STRING
      },
      RB2: {
        type: Sequelize.STRING
      },
      WR1: {
        type: Sequelize.STRING
      },
      WR2: {
        type: Sequelize.STRING
      },
      TE: {
        type: Sequelize.STRING
      },
      FLEX: {
        type: Sequelize.STRING
      },
      DST: {
        type: Sequelize.STRING
      },
      K: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Rosters');
  }
};