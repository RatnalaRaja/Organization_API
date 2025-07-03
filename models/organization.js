const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Organization = sequelize.define('Organization', {
  org_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  org_id: {
    type: DataTypes.STRING,
    primaryKey:true,
    allowNull: false,
  }
}, {
  tableName: 'organizations', 
  timestamps: false,
});

module.exports = Organization;
