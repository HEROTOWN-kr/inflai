const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

function checkAssociate(modelItem) {
  const newModel = { ...modelItem };

  switch (modelItem.name) {
    case 'TB_INFLUENCER': {
      modelItem.associate = function (models) {
        modelItem.hasMany(models.TB_NOTIFICATE, { foreignKey: 'INF_ID', sourceKey: 'INF_ID' });
      };
      break;
    }
    case 'TB_NOTIFICATION': {
      modelItem.associate = function (models) {
        modelItem.belongsTo(models.TB_INFLUENCER, { foreignKey: 'INF_ID', targetKey: 'INF_ID' });
      };
      break;
    }
    default: {
      return modelItem;
    }
  }
  return modelItem;
}

const sequelize = new Sequelize('mysql://inflai:herotown2020!@127.0.0.1:3306/inflai', {
  define: {
    timestamps: false // true by default. false because bydefault sequelize adds createdAt, modifiedAt columns with timestamps.if you want those columns make ths true.
  },
  query: {
    // plain: true
    // raw:true
  }
});
const db = {};

fs.readdirSync(__dirname).filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js')).forEach((file) => {
  const model = sequelize.import(path.join(__dirname, file));
  // const returnModel = checkAssociate(model);
  // db[returnModel.name] = returnModel;
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
