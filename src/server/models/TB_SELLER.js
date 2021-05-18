/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Seller = sequelize.define('TB_SELLER', {
    SEL_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    SEL_NAME: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    SEL_EMAIL: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    SEL_TEL: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    SEL_BLOG: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    SEL_INSTA: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    SEL_YOUTUBE: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    SEL_SALES_NUM: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    SEL_BIO: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    SEL_DT: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_SELLER'
  });

  return Seller;
};
