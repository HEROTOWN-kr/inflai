/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Ad = sequelize.define('TB_AD', {
    AD_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ADV_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'TB_ADVERTISER',
        key: 'ADV_ID'
      }
    },
    AD_INSTA: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    AD_YOUTUBE: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    AD_NAVER: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    AD_TYPE: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_INF_CNT: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    AD_SRCH_START: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    AD_SRCH_END: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    AD_DELIVERY: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    AD_VISIBLE: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    AD_CTG: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    AD_CTG2: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_POST_CODE: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    AD_ROAD_ADDR: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    AD_DETAIL_ADDR: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    AD_EXTR_ADDR: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_TEL: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_EMAIL: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    AD_NAME: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    AD_SHRT_DISC: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    AD_SEARCH_KEY: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    AD_DISC: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    AD_DETAIL: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    AD_PROVIDE: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    AD_INF_NANO: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    AD_INF_MICRO: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    AD_INF_MACRO: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    AD_INF_MEGA: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    AD_INF_CELEB: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    AD_PRICE: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    AD_PROD_PRICE: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    AD_PROD_REUSE: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: 'N'
    },
    AD_PROD_NAME: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_POST_END: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    AD_SEX: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    AD_AGE: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    AD_CHANNEL: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    AD_COMP_NAME: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_PHOTO: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_ABOUT: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_SPON_ITEM: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_CONT_TYPE: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_VIDEO_TYPE: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_PUBL_TEXT: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_TAGS: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_ADD_TAGS: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_LINK: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    AD_MESSAGE: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: '0'
    },
    AD_UID: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    AD_PAID: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: 'N'
    },
    AD_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_AD',
    /* associate: (models) => {
      this.hasMany(models.TB_ADVERTISER);
    } */
  });

  Ad.associate = function (models) {
    Ad.belongsTo(models.TB_ADVERTISER, { foreignKey: 'ADV_ID', targetKey: 'ADV_ID' });
    Ad.hasMany(models.TB_NOTIFICATION, { foreignKey: 'AD_ID', sourceKey: 'AD_ID' });
    Ad.hasMany(models.TB_PARTICIPANT, { foreignKey: 'AD_ID', sourceKey: 'AD_ID' });
    Ad.hasMany(models.TB_PHOTO_AD, { foreignKey: 'AD_ID', sourceKey: 'AD_ID' });
  };

  return Ad;
};
