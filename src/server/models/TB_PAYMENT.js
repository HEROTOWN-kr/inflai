/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('TB_PAYMENT', {
    PAY_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ADV_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TB_ADVERTISER',
        key: 'ADV_ID'
      }
    },
    PAY_TNO: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    PAY_AMOUNT: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    PAY_POINTS: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    PAY_DT: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_PAYMENT'
  });
};
