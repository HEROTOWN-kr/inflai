/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const NaverInf = sequelize.define('TB_NAVER_INF', {
    NIF_ID: {
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
    NIF_ACC_ID: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    NIF_DT: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_NAVER_INF'
  });

  NaverInf.associate = function (models) {
    NaverInf.belongsTo(models.TB_INFLUENCER, { foreignKey: 'INF_ID', targetKey: 'INF_ID' });
  };

  return NaverInf;
};
