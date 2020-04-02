/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('TB_PHOTO_AD', {
    PHO_ID: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    AD_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'TB_AD',
        key: 'AD_ID'
      }
    },
    PHO_FILE: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    PHO_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_PHOTO_AD'
  });
};
