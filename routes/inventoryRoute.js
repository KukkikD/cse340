// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index.js");
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to display vehicle details by ID
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId))

// Route to render management view
router.get("/", utilities.handleErrors(invController.renderManagementView))

// Route to build classification view
router.get("/add-classification", utilities.handleErrors(invController.addClassification))

// Route to process add Classivication
router.post("/add-classification", regValidate.addClassificationRules(),
regValidate.checkClassificationData, utilities.handleErrors(invController.addNewClassification))

// Route to build add inventory
router.get("/add-inventory", utilities.handleErrors(invController.addInventory))

// Process the add inventory form
router.post("/add-inventory", regValidate.addInventoryRules(),
regValidate.checkInventoryData, utilities.handleErrors(invController.addNewInventory))

//Week 05: getInventory for AJX route.
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//week 05: build edit inventory view route.
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

//week 05: process update inventory 
router.post("/update", regValidate.addInventoryRules(), regValidate.checkInventoryUpdateData, utilities.handleErrors(invController.updateInventory)) 

//week05 :// add deleting view
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteView))

//week05 :// deleting process
router.post("/delete", utilities.handleErrors(invController.deleteItem))


module.exports = router;

