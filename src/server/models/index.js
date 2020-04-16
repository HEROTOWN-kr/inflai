const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

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
