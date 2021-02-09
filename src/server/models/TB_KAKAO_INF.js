/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const KakInf = sequelize.define('TB_KAKAO_INF', {
    KAK_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    INF_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TB_INFLUENCER',
        key: 'INF_ID'
      }
    },
    KAK_ACC_ID: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    KAK_DT: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_KAKAO_INF'
  });

  KakInf.associate = function (models) {
    KakInf.belongsTo(models.TB_INFLUENCER, { foreignKey: 'INF_ID', targetKey: 'INF_ID' });
  };

  return KakInf;
};
