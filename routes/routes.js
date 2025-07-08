const sequelize = require('../models/database');
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Organization = require('../models/organization');
const protect = require("../middleware/auth");

const generateToken = (org) => {
  return jwt.sign({ id: org.org_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_Expire,
  });
};

router.get("/org", async (req, res) => {
  try {
    //const orgs = await Organization.findAll();
    const [orgs,metadata] = await sequelize.query("select org_name,org_id from Organizations");
    res.status(200).json(orgs);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

router.post("/org", async (req, res) => {
  try {
    const { org_name, org_id } = req.body;
    if (!org_name || !org_id) {
      return res.status(400).json("All fields are required");
    }
    const orgs = await Organization.create({ org_name, org_id });
    //const token = generateToken(orgs);
    //console.log(token);
    res.status(201).json({
      message: "Org Created Successfully",
      org: orgs,
    
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// router.put('/org/:id', async (req, res) => {
//   try {
//     const orgId = await Organization.findByPk(req.params.id);
   
//     if (orgId) {
//       await orgId.update(req.body);
//       res.json({ message: "Organization Updated", org: orgId });
//     } else {
//       res.status(404).json("Organization not found");
//     }
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });


router.delete('/org/:id', async (req, res) => {
  try {
    const deleteorg = await Organization.findByPk(req.params.id);
    if (deleteorg) {
      await deleteorg.destroy();
      res.status(204).json({ message: 'Organization Deleted Successfully' });
    } else {
      res.status(404).json("Organization Not found");
    }
  } catch (error) {
    res.status(500).json("Server Error");
  }
});

module.exports = router;


router.put('/org/:id', async (req, res) => {
  try {
    const orgId = req.params.id;
    const { org_name } = req.body;

    
    const [org] = await sequelize.query(
      "SELECT * FROM organizations WHERE org_id = :id",
      {
        replacements: { id: orgId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

  
    await sequelize.query(
      "UPDATE organizations SET org_name = :org_name WHERE org_id = :id",
      {
        replacements: {org_name,id: orgId },
        type: sequelize.QueryTypes.UPDATE
      }
    );

    res.json({ message: "Organization updated successfully" });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
