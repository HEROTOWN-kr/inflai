/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const participant = sequelize.define('TB_PARTICIPANT', {
    PAR_ID: {
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
    AD_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TB_AD',
        key: 'AD_ID'
      }
    },
    PAR_INSTA: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PAR_YOUTUBE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PAR_NAVER: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PAR_NAME: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    PAR_MESSAGE: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    PAR_TEL: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    PAR_EMAIL: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    PAR_RECEIVER: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    PAR_POST_CODE: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    PAR_ROAD_ADDR: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    PAR_DETAIL_ADDR: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    PAR_EXTR_ADDR: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    PAR_STATUS: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: '1'
    },
    PAR_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_PARTICIPANT',
  });

  participant.associate = function (models) {
    participant.belongsTo(models.TB_INFLUENCER, { foreignKey: 'INF_ID', targetKey: 'INF_ID' });
    participant.belongsTo(models.TB_AD, { foreignKey: 'AD_ID', targetKey: 'AD_ID' });
  };

  return participant;
};
