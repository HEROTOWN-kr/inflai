/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const ReqAd = sequelize.define('TB_REQ_AD', {
    REQ_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ADV_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'TB_ADVERTISER',
        key: 'ADV_ID'
      }
    },
    REQ_COMP_NAME: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    REQ_NAME: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    REQ_EMAIL: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    REQ_TEL: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    REQ_BRAND: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    REQ_AIM: {
      type: DataTypes.STRING(400),
      allowNull: false
    },
    REQ_ANOTHER_AIM: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    REQ_BUDJET: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    REQ_CONSULT: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    REQ_OTHER: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    REQ_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_REQ_AD'
  });

  ReqAd.associate = function (models) {
    ReqAd.belongsTo(models.TB_ADVERTISER, { foreignKey: 'ADV_ID', targetKey: 'ADV_ID' });
  };

  return ReqAd;
};
