const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
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

      // Set req.accountData for middleware to use.
      req.accountData = accountData

      // Set req.session.user
      req.session.user = {
        account_id: accountData.account_id,
        account_email: accountData.account_email,
      }

      console.log("Session user:", req.session.user) // ตรวจสอบว่าค่าถูกต้องหรือไม่

      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/account-management")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
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

/* ****************************************
*  Week 05: Account management
*  build logout view 
* *************************************** */
async function logoutAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.clearCookie('jwt')
  req.flash("notice", "You have loged out.")
  res.redirect("/")
}

/**
 * Display the restricted area view for authorized users
 */
const restrictedAreaView = async (req, res) => {
  try {
    res.render("account/restricted", {
      title: "Restricted Area",
      message: "Welcome to the restricted area, accessible only to authorized users!",
      accountData: res.locals.accountData,
    });
  } catch (error) {
    console.error("Error displaying restricted area:", error)
    res.status(500).send("Internal Server Error")
  }
}

/* ****************************************
 *  Deliver edit account view
 * *************************************** */
async function buildEditAccount(req, res, next) {
  const accountId = parseInt(req.params.account_id);
  const localId = parseInt(res.locals.accountData.account_id)

  if (accountId === localId) {
    try {
      const info = await accountModel.getAccountById(accountId)
      let nav = await utilities.getNav();

      res.render("account/edit", {
        title: "Edit Account",
        nav,
        errors: null,
        account_id: accountId,
        account_firstname: info.account_firstname,
        account_lastname: info.account_lastname,
        account_email: info.account_email,
      });
    } catch (error) {
      console.error("Error fetching account info:", error);
      req.flash("notice", "An error occurred while fetching account data.")
      res.redirect("/account");
    }
  } else {
    req.flash("notice", "Invalid access.")
    res.redirect("/account")
  }
}

/* ****************************************
 * Generate edit account info response
 * *************************************** */
async function updateInfoData(req, res, next) {
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body;

  if (!account_firstname || !account_lastname || !account_email) {
    req.flash("notice", "All fields are required.")
    return res.redirect(`/account/edit/${account_id}`)
  }

  try {
    await accountModel.updateInfoData(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    req.flash("notice", "Congratulations, your information has been updated.")
    res.redirect("/account")

  } catch (error) {
    console.error("Error updating account info:", error)
    req.flash("notice", "An unexpected error occurred while updating your information.")
    res.status(500).redirect(`/account/edit/${account_id}`)
  }
}

/* ****************************************
 * Generate edit account password response
 * *************************************** */
async function updatePassword(req, res, next) {
  const { 
    account_id,
    account_password
  } = req.body
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.')
    res.status(501).redirect(`${account_id}`)
  } 
  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  )
  // const updateResult = null
  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
    res.redirect("/account")
  } else {
    req.flash('notice', 'Sorry, the password update failed.')
    res.status(501).redirect(`${account_id}`)
  }
}

module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagementView, logoutAccount, restrictedAreaView, buildEditAccount,  updateInfoData, updatePassword };


// line 127 : uses the bcrypt.compare() function which takes the incoming, plain text password and the hashed password from the database and compares them to see if they match.

