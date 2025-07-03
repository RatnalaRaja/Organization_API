
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'Redrose@2025', {
  host: 'localhost',
  dialect: 'postgres',
  //port:"5500",
  logging: console.log,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
