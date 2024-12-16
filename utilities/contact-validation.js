const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const contactModel = require("../models/contact-model")

/*  **********************************
  *  Contact Form Validation Rules
  * ********************************* */
validate.contactRules = () => {
    return [
      // subject is required and must be at least 1 character
      body("subject")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a subject."),

      // message is required and must not be empty
      body("message")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a message."),
    ]
}

/* ******************************
 * Check contact data and return errors or continue to submission
 * ***************************** */
validate.checkContactData = async (req, res, next) => {
    const { account_id, account_email, subject, message } = req.body
    let errors = validationResult(req)
  
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("contact/contactUs", {
        errors,
        title: "Contact Us",
        nav,
        account_id,
        account_email,
        subject,    // เพิ่ม subject เป็นค่าว่าง
        message,   // ส่ง message กลับไป
      })
      return
    }
    next()
  }


module.exports = validate
