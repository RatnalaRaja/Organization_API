
const express = require('express');
const app = express();
const organization=require("./models/organization");
const orgRoutes = require('./routes/routes');
const sequelize=require('./models/database'); 
const employee=require('./models/employee');
const empRoutes=require('./routes/routes.employee');
const org_emp_routes=require("./routes/routes.orgToemp");

app.use(express.json());
app.use('/api', orgRoutes); 
app.use('/emapi',empRoutes);
app.use('/org',org_emp_routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
sequelize.authenticate().then(()=>{
    console.log(' Database Connected');
    
}) 
.catch(err=>{
    console.log('Connection Error',err);
});

sequelize.sync().then(()=>{
  console.log("Tables Sync");
})
.catch(err=>{
  console.log('Not sync');
});


