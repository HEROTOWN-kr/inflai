/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Payment = sequelize.define('TB_PAYMENT', {
    PAY_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ADV_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    PAY_TNO: {
      type: DataTypes.STRING(14),
      allowNull: true
    },
    PAY_AMOUNT: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    PAY_PNT_ISSUE: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    PAY_CARD_CD: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    PAY_CARD_NAME: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    PAY_APP_TIME: {
      type: DataTypes.STRING(14),
      allowNull: true
    },
    PAY_APP_NO: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    PAY_NOINF: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    PAY_QUOTA: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    PAY_PARTCANC_YN: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    PAY_CARD_BIN_TYPE_01: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    PAY_CARD_BIN_TYPE_02: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    PAY_CARD_MNY: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    PAY_COUPON_MNY: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    PAY_PNT_AMOUNT: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    PAY_PNT_APP_TIME: {
      type: DataTypes.STRING(14),
      allowNull: true
    },
    PAY_PNT_APP_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PAY_ADD_PNT: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    PAY_USE_PNT: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    PAY_RSV_PNT: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    PAY_TOTAL_AMOUNT: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    PAY_BANK_NAME: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PAY_BANK_CODE: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    PAY_BK_MNY: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    PAY_BANKNAME: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PAY_DEPOSITOR: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    PAY_ACCOUNT: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PAY_VA_DATE: {
      type: DataTypes.STRING(14),
      allowNull: true
    },
    PAY_COMMID: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    PAY_MOBILE_NO: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    PAY_TK_VAN_CODE: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    PAY_TK_APP_NO: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PAY_CASH_AUTHNO: {
      type: DataTypes.STRING(9),
      allowNull: true
    },
    PAY_CASH_NO: {
      type: DataTypes.STRING(14),
      allowNull: true
    },
    PAY_DT: {
      type: 'TIMESTAMP',
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'TB_PAYMENT'
  });

  Payment.associate = function (models) {
    Payment.belongsTo(models.TB_ADVERTISER, { foreignKey: 'ADV_ID', targetKey: 'ADV_ID' });
  };

  return Payment;
};
