const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const Organization = require("./organization"); 

const Employee = sequelize.define("Employee", {
  emp_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  emp_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emp_role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  org_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Organization,
      key: 'org_id',
    },
  },
}, {
  tableName: 'Employee',
  timestamps: false,
});

Organization.hasMany(Employee, { foreignKey: 'org_id' });
Employee.belongsTo(Organization, { foreignKey: 'org_id' });

module.exports = Employee;
