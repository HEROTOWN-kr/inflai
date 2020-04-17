/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TB_ADMIN', {
    ADM_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ADM_NAME: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    ADM_PASS: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'TB_ADMIN'
  });
};
