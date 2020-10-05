'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Rosters', [
      {
        QB: 'Aaron Rodgers',
        userId: 1
      },
      {
        QB: 'Nick Foles',
        userId: 2
      },
      {
        QB: 'Kirk Cousins',
        userId: 3
      }
    ], {});
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
