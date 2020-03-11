/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TB_INFLUENCER', {
    INF_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    INF_NAME: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    INF_TEL: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    INF_EMAIL: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    INF_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_INFLUENCER'
  });
};
