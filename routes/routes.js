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

router.get("/org", protect,async (req, res) => {
  try {
    const orgs = await Organization.findAll();
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
    const token = generateToken(orgs);
    console.log(token);
    res.status(201).json({
      message: "Org Created Successfully",
      org: orgs,
    
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

router.put('/org/:id', async (req, res) => {
  try {
    const orgId = await Organization.findByPk(req.params.id);
    if (orgId) {
      await orgId.update(req.body);
      res.json({ message: "Organization Updated", org: orgId });
    } else {
      res.status(404).json("Organization not found");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


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
