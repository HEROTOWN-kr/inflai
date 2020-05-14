/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const notification = sequelize.define('TB_NOTIFICATION', {
    NOTI_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    INF_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'TB_INFLUENCER',
        key: 'INF_ID'
      }
    },
    AD_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'TB_AD',
        key: 'AD_ID'
      }
    },
    NOTI_STATE: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: '3'
    },
    NOTI_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_NOTIFICATION',
    /* associate: (models) => {
      this.hasMany(models.TB_ADVERTISER);
    } */
  });

  notification.associate = function (models) {
    notification.belongsTo(models.TB_INFLUENCER, { foreignKey: 'INF_ID', targetKey: 'INF_ID' });
    notification.belongsTo(models.TB_AD, { foreignKey: 'AD_ID', targetKey: 'AD_ID' });
  };

  return notification;
};
