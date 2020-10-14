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
      primaryKey: true,
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
    INS_NAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    INS_USERNAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    INS_MEDIA_CNT: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
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
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    INS_LIKES: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INS_CMNT: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INS_STAT_AGE: {
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    INS_STATE_GEN_LOC: {
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    INS_TYPES: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    INS_IS_FAKE: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    INS_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_INSTA',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  });

  Instagram.associate = function (models) {
    Instagram.belongsTo(models.TB_INFLUENCER, { foreignKey: 'INF_ID', targetKey: 'INF_ID' });
  };

  return Instagram;
};
