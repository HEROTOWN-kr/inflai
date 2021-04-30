/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Naver = sequelize.define('TB_NAVER', {
    NAV_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    INF_ID: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    NAV_URL: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    NAV_BLOG_ID: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    NAV_FLWR: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    NAV_CONT: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    NAV_GUEST: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    NAV_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_NAVER'
  });

  Naver.associate = function (models) {
    Naver.belongsTo(models.TB_INFLUENCER, { foreignKey: 'INF_ID', targetKey: 'INF_ID' });
  };

  return Naver;
};
