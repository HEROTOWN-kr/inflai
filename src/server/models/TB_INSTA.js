/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Instagram = sequelize.define('TB_INSTA', {
    INS_ID: {
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
    INS_TOKEN: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    INS_ACCOUNT_ID: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    INS_FLW: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    INS_FLWR: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    INS_PROFILE_IMG: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    INS_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_INSTA'
  });

  Instagram.associate = function (models) {
    Instagram.belongsTo(models.TB_INFLUENCER, { foreignKey: 'INF_ID', targetKey: 'INF_ID' });
  };

  return Instagram;
};
