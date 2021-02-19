/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const NaverAdv = sequelize.define('TB_NAVER_ADV', {
    NAD_ID: {
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
    NAD_ACC_ID: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    NAD_DT: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_NAVER_ADV'
  });

  NaverAdv.associate = function (models) {
    NaverAdv.belongsTo(models.TB_ADVERTISER, { foreignKey: 'ADV_ID', targetKey: 'ADV_ID' });
  };

  return NaverAdv;
};
