/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const KakAdv = sequelize.define('TB_KAKAO_ADV', {
    KAD_ID: {
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
      }
    },
    KAD_ACC_ID: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    KAD_DT: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_KAKAO_ADV'
  });

  KakAdv.associate = function (models) {
    KakAdv.belongsTo(models.TB_ADVERTISER, { foreignKey: 'ADV_ID', targetKey: 'ADV_ID' });
  };

  return KakAdv;
};
