/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TB_ADVERTISER', {
    ADV_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ADV_NAME: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ADV_TEL: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ADV_EMAIL: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ADV_TOKEN: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    ADV_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_ADVERTISER'
  });
};
