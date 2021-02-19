/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const FacebookAdv = sequelize.define('TB_FB_ADV', {
    FAD_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ADV_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TB_ADVERTISER',
        key: 'ADV_ID'
      }
    },
    FAD_FB_ID: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    FAD_DT: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_FB_ADV'
  });

  FacebookAdv.associate = function (models) {
    FacebookAdv.belongsTo(models.TB_ADVERTISER, { foreignKey: 'ADV_ID', targetKey: 'ADV_ID' });
  };

  return FacebookAdv;
};
