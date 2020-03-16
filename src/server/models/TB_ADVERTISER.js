/* jshint indent: 2 */
const bcrypt = require('bcryptjs');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TB_ADVERTISER', {
    ADV_ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ADV_PASS: {
      type: DataTypes.STRING(300),
      allowNull: true
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
    ADV_REG_ID: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    ADV_DT: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_ADVERTISER',
    instanceMethods: {
      generateHash(password) {
        return bcrypt.hash(password, bcrypt.genSaltSync(8));
      },
      validPassword(password, hash, callback) {
        return bcrypt.compare(password, hash, (err, res) => {
          if (err) callback(err, null);
          else callback(null, res);
        });
      }
    }
  });
};
