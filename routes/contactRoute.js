const express = require("express")
const router = express.Router()
const contactController = require("../controllers/contactController")
const utilities = require("../utilities")
const regValidate = require('../utilities/contact-validation')

router.get("/contactUs", utilities.checkLogin, utilities.handleErrors(contactController.showContactForm))

router.post("/contactUs", utilities.checkLogin, regValidate.contactRules(), regValidate.checkContactData, utilities.handleErrors(contactController.handleContactSubmission))

module.exports = router;