const sequelize=require("../models/database");
const express=require("express");
const routerEmp=express.Router();
const Employee = require("../models/employee");

console.log("Hii route");

routerEmp.get("/emp",async(req,res)=>{
    const empls= await Employee.findAll();
    res.status(200).json(empls);
});

routerEmp.post('/emp',async(req,res)=>{
    try{
        const {emp_name,emp_id,emp_role,org_id}=req.body;
        if(!emp_name|| !emp_id|| !emp_role ||!org_id){
            return res.status(400).json("All fields are mandatory");
        }
        const emp=await Employee.create({emp_name,emp_id,emp_role,org_id});
        res.status(201).json({
            message:"Employee Created Successfully",
            employee:emp,
        })
    }catch(error){
        console.log("Error Creating Employee",error);
        res.status(500).json("Server error",error.message);

    }
});

routerEmp.put('/emp/:id',async(req,res)=>{
    try {
        const emps= await Employee.findByPk(req.params.id);
        if(emps){
            await emps.update(req.body);
            res.json({message:"Updated Successfully",
                emp:emps
            })
        }
        else{
            res.status(404).json("Employee Not Found");
        }

    } catch (error) {
        res.status(400).json(error.message);
    }
});

routerEmp.delete('/emp/:id', async (req, res) => {
  try {
    const deleteEmp = await Employee.findByPk(req.params.id);
    if (deleteEmp) {
      await deleteEmp.destroy();
      return res.status(200).json("Employee Deleted Successfully");
    } else {
      return res.status(404).json("Employee Not Found");
    }

  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server Error");
  }
});

















module.exports=routerEmp;