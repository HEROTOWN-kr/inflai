/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Favorites = sequelize.define('TB_FAVORITES', {
    FAV_ID: {
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
    FAV_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_FAVORITES'
  });

  Favorites.associate = function (models) {
    Favorites.belongsTo(models.TB_INFLUENCER, { foreignKey: 'INF_ID', targetKey: 'INF_ID' });
    Favorites.belongsTo(models.TB_AD, { foreignKey: 'AD_ID', targetKey: 'AD_ID' });
  };

  return Favorites;
};
