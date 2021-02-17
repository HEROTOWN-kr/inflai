/* jshint indent: 2 */
const bcrypt = require('bcryptjs');

module.exports = function (sequelize, DataTypes) {
  const influencer = sequelize.define('TB_INFLUENCER', {
    INF_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    INF_PASS: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    INF_NAME: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    INF_TEL: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    INF_EMAIL: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    INF_PHOTO: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    INF_REG_ID: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    INF_CHANNEL: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    INF_POST_CODE: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    INF_ROAD_ADDR: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    INF_DETAIL_ADDR: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    INF_EXTR_ADDR: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    INF_COUNTRY: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    INF_CITY: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    INF_AREA: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    INF_PROD: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    INF_MESSAGE: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    INF_INST_ID: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    INF_TOKEN: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    INF_REF_TOKEN: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    INF_BLOG_TYPE: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    INF_BLOG_URL: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    INF_ACTIVATED: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    INF_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_INFLUENCER',
    instanceMethods: {
      generateHash(password) {
        return bcrypt.hash(password, bcrypt.genSaltSync(8));
      },
      validPassword(password, hash, callback) {
        return bcrypt.compare(password, hash, (err, res) => {
          if (err) callback(err, null);
          if (err) callback(err, null);
          else callback(null, res);
        });
      }
    }
  });

  influencer.associate = function (models) {
    influencer.hasMany(models.TB_NOTIFICATION, { foreignKey: 'INF_ID', sourceKey: 'INF_ID' });
    influencer.hasMany(models.TB_FAVORITES, { foreignKey: 'INF_ID', sourceKey: 'INF_ID' });
    influencer.hasMany(models.TB_PARTICIPANT, { foreignKey: 'INF_ID', sourceKey: 'INF_ID' });
    influencer.hasOne(models.TB_INSTA, { foreignKey: 'INF_ID', sourceKey: 'INF_ID' });
    influencer.hasOne(models.TB_YOUTUBE, { foreignKey: 'INF_ID', sourceKey: 'INF_ID' });
    influencer.hasOne(models.TB_NAVER, { foreignKey: 'INF_ID', sourceKey: 'INF_ID' });
    influencer.hasOne(models.TB_NAVER_INF, { foreignKey: 'INF_ID', sourceKey: 'INF_ID' });
    influencer.hasOne(models.TB_KAKAO_INF, { foreignKey: 'INF_ID', sourceKey: 'INF_ID' });
  };

  return influencer;
};
