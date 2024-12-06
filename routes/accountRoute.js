// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index.js")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post("/register", regValidate.registationRules(),
regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

/* **************************************
* Process  login
* week04 : stickiness activity
* modify in week 05 : login process activity 
* ************************************ */
router.post("/login", regValidate.loginRules(),
regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin)) //modifiy from accountController.loginAccount

// week 05: Build account management view route
router.get("/account-management", utilities.handleErrors(accountController.buildAccountManagementView))

/* ****************************************
*  Deliver Account Management view
* week 05 : JWT Authorization acctivity 
* *************************************** */
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView))

module.exports = router;