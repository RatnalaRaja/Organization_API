module.exports = (Organization, Employee) => {
  Organization.hasMany(Employee, { foreignKey: 'org_id' });
  Employee.belongsTo(Organization, { foreignKey: 'org_id' });
};