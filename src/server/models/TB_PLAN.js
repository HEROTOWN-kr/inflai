/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('TB_PLAN', {
    PLN_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    PLN_NAME: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    PLN_DETAIL: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    PLN_DETAIL2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    PLN_INF_MONTH: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    PLN_PRICE_MONTH: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    PLN_DSCNT: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    PLN_DT: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_PLAN'
  });
};
