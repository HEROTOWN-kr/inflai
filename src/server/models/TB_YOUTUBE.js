/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Youtube = sequelize.define('TB_YOUTUBE', {
    YOU_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    INF_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'TB_INFLUENCER',
        key: 'INF_ID'
      }
    },
    YOU_TOKEN: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    YOU_SUBS: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    YOU_VIEWS: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    YOU_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_YOUTUBE'
  });

  Youtube.associate = function (models) {
    Youtube.belongsTo(models.TB_INFLUENCER, { foreignKey: 'INF_ID', targetKey: 'INF_ID' });
  };

  return Youtube;
};
