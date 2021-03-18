/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Photo = sequelize.define('TB_PHOTO_AD', {
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
      type: DataTypes.STRING(400),
      allowNull: true
    },
    PHO_FILE_URL: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    PHO_FILE_KEY: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    PHO_IS_MAIN: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    PHO_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_PHOTO_AD'
  });

  Photo.associate = function (models) {
    Photo.belongsTo(models.TB_AD, { foreignKey: 'AD_ID', targetKey: 'AD_ID' });
  };

  return Photo;
};
