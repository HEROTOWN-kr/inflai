/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TB_AD', {
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
    AD_TYPE: {
      type: DataTypes.STRING(45),
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
    AD_CTG: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    AD_SRCH_START: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    AD_SRCH_END: {
      type: DataTypes.DATEONLY,
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
    tableName: 'TB_AD'
  });
};
