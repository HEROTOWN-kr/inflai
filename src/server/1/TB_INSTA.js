/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TB_INSTA', {
    INS_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    INF_ID: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    INS_FLW: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    INS_FLWR: {
      type: DataTypes.INTEGER,
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
    INS_IS_FAKE: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    INS_DT: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_INSTA'
  });
};
