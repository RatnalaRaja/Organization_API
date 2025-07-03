const express = require("express");
const routerOE = express.Router();
const Emp = require("../models/employee");
const Org = require("../models/organization");

routerOE.get("/org_emp/:orgId", async (req, res) => {
  try {
    const orgId = req.params.orgId;

    const emp = await Emp.findAll({
      where: { org_id: orgId },
      include: {
        model: Org,
      },
    });

    if (emp.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }

    res.json(emp);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = routerOE;
