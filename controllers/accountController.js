const utilities = require("../utilities/")
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}
  
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })

  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  } 
}

/* ****************************************
*  Process login
* *************************************** */
/* async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password} = req.body

  const regResult = await accountModel.loginAccount(
    account_email,
    account_password
  )
  if (regResult) {
    req.flash("notice", "Your Login successful.")
    res.status(201).render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the login failed.")
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
} // ex. function from Week04 before add the Jwt to compare hash password now use the function accountLogin instead of this function*/

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/account-management")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


/* ****************************************
* week 05 : acctivity 
*  Deliver Account Management view
* *************************************** */
async function buildAccountManagementView(req, res, next) {
  let nav = await utilities.getNav()
    res.render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null, // or req.flash("errors") if you are managing error messages
    })
}


module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagementView};


// line 127 : uses the bcrypt.compare() function which takes the incoming, plain text password and the hashed password from the database and compares them to see if they match.