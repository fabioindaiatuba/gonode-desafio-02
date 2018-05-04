const Sequelize = require('sequelize');

module.exports = {
  username: 'root',
  password: 'root',
  database: 'gonode_docfy',
  host: '127.0.0.1',
  dialect: 'mysql',
  operatorsAliases: Sequelize.Op,
};
