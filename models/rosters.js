'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rosters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Rosters.init({
    QB: DataTypes.STRING,
    RB1: DataTypes.STRING,
    RB2: DataTypes.STRING,
    WR1: DataTypes.STRING,
    WR2: DataTypes.STRING,
    TE: DataTypes.STRING,
    FLEX: DataTypes.STRING,
    DST: DataTypes.STRING,
    K: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Rosters',
  });
  return Rosters;
};