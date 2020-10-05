'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users",
      [
        {
          name: "Tony Stark",
          username: "ironman",
          password: "prettyawesome",
          teamName: "Avengers"
        },
        {
          name: "Clark Kent",
          username: "superman",
          password: "canfly",
          teamName: "Super Powers"
        },
        {
          name: "Bruce Wayne",
          username: "batman",
          password: "hasgadgets",
          teamName: "Gotham"
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
