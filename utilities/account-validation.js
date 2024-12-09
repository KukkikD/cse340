const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")
const bcrypt = require('bcryptjs');


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
        

      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }


/*  **********************************
  *  login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    return [
      // Email must have in DB
      body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail() // use validator.js for normalize email
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
      
          const emailExists = await accountModel.checkExistingEmail(account_email);
          if (!emailExists) {
            throw new Error("Email does not exist. Please register.");
          }
        }),
  
      // Password must match the information in the database.
     /* body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password is required.")
        .custom(async (account_password, { req }) => {
          const account_email = req.body.account_email; // Retrieve email that filled in form
          const account = await accountModel.getAccountByEmail(account_email); // Retrieve account information from DB
          if (!account) {
            throw new Error("Invalid email or password."); // in case no email in DB
          }
  
          //validate password by bcrypt
         const isMatch = await bcrypt.compare(account_password, account.account_password);
          if (!isMatch) {
            throw new Error("Invalid email or password."); // password not match in DB
          }
        }),
    ]
  } */

        // password is required and must be strong password
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
       .withMessage("Password does not meet requirements."),
    ]
    }


    /* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
    validate.checkLoginData = async (req, res, next) => {
      const { account_email } = req.body
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
          errors,
          title: "login",
          nav,
          account_email,
        })
        return
      }
      next()
    }

/* ******************************

 * update account Validation Rules
 * ***************************** */
validate.UpdateInfoRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.
      

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required."),
    

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty(),
     /* .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),*/
  ]
}

/*  **********************************
  *  update account password Validation Rules
  * ********************************* */
validate.UpdatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }),
  ]
}

/* ******************************
 * Check data and return errors or continue to update information
 * ***************************** */
validate.checkUpdateInfoData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/edit", {
      errors,
      title: "Edit Account",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* ******************************
* Check data and return errors or continue to login
* ***************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
const { account_id } = req.body
let errors = []
errors = validationResult(req)
if (!errors.isEmpty()) {
  req.flash("notice", "Invalid password")
  res.redirect(`${account_id}`)
  return
}
next()
}


  module.exports = validate
