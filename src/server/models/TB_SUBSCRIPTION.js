/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Subscription = sequelize.define('TB_SUBSCRIPTION', {
    SUB_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ADV_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TB_ADVERTISER',
        key: 'ADV_ID'
      },
    },
    PLN_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TB_PLAN',
        key: 'PLN_ID'
      },
    },
    SUB_START_DT: {
      type: DataTypes.DATE,
      allowNull: true
    },
    SUB_END_DT: {
      type: DataTypes.DATE,
      allowNull: true
    },
    SUB_STATUS: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: '1'
    },
    SUB_ACTIVE: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: '0'
    },
    SUB_DT: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_SUBSCRIPTION'
  });

  Subscription.associate = function (models) {
    Subscription.belongsTo(models.TB_ADVERTISER, { foreignKey: 'ADV_ID', targetKey: 'ADV_ID' });
    Subscription.belongsTo(models.TB_PLAN, { foreignKey: 'PLN_ID', targetKey: 'PLN_ID' });
  };

  return Subscription;
};
