/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TB_PRICE', {
    PRC_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    PRC_NANO: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    PRC_MICRO: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    PRC_MACRO: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    PRC_MEGA: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    PRC_CELEBRITY: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'TB_PRICE'
  });
};
