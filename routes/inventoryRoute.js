// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index.js");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to display vehicle details by ID
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));


module.exports = router;

