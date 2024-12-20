const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  try {
    let data = await invModel.getClassifications()
    if (!data || !data.rows || data.rows.length === 0) {
      throw new Error("No classifications found")
    }
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
      list += "<li>"
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
      list += "</li>"
    })
    list += "</ul>"
    return list
  } catch (err) {
    console.error("Error generating navigation:", err.message)
    throw err // send to error handler
  }
}

/* **************************************
 * Build the classification view HTML
 ************************************** */
Util.buildClassificationGrid = async function (data) {
  try {
    if (!data || data.length === 0) {
      return '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    let grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += '<li>'
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += "<hr />"
      grid += "<h2>"
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>"
      grid += "</h2>"
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>"
      grid += "</div>"
      grid += "</li>"
    })
    grid += "</ul>"
    return grid
  } catch (err) {
    console.error("Error building classification grid:", err.message)
    throw err
  }
}


/* ****************************************
 * Build the vehicle details view HTML
 **************************************** */
Util.buildVehicleDetails = function (vehicle) {
  try {
    if (!vehicle) {
      throw new Error("Vehicle data is missing")
    }
    let details = `
      <div class="vehicle-details">
        <section class ="vehicleImg">
          <img id="vehicle-img" src="${vehicle.inv_image || "#"}" alt="Image of ${
      vehicle.inv_make || "Unknown Make"
    } ${vehicle.inv_model || "Unknown Model"}">
        </section>
        <section class ="vehicle-info">
        <h2>${vehicle.inv_make || "Unknown Make"} ${
      vehicle.inv_model || "Unknown Model"
    } Details:</h2>
          <p class="price"><strong>Price:</strong> $${
            vehicle.inv_price
              ? new Intl.NumberFormat("en-US").format(vehicle.inv_price)
              : "N/A"
          }</p>
          <p><strong>Description:</strong> ${
            vehicle.inv_description || "No description available"
          }</p>
          <p class="colors"><strong>Color:</strong> ${
            vehicle.inv_color || "Unknown"
          }</p>
          <p><strong>Mileage:</strong> ${
            vehicle.inv_miles
            ? vehicle.inv_miles + " miles"
            : "N/A"
          }</p>
        </section>
      </div>
    `
    return details
  } catch (err) {
    console.error("Error building vehicle details:", err.message)
    throw err
  }
}

/* **************************************
* Build the selection for the add inventory view
* ************************************ */
Util.chooseClassification = async function (classification_id = null) {
  try {
    let data = await invModel.getClassifications()
    console.log(data.rows) // ตรวจสอบข้อมูลที่ได้จาก getClassifications

    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"

    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        parseInt(row.classification_id) === parseInt(classification_id)
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })

    classificationList += "</select>"
    return classificationList
  } catch (error) {
    console.error("Error in chooseClassification:", error)
    throw error
  }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  console.log("Session User in checkLogin:", req.session.user);
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  week 05 Account Management 
 *  Middleware For 
 *  Check Account Type (admin, employee or client)
 * ************************************ */
Util.checkAdminOrEmployee = (req, res, next) => {
  if (req.accountData && (req.accountData.account_type === 'Admin' || req.accountData.account_type === 'Employee')) {
    next() // if pass will be Admin or Employee
  } else {
    req.flash('error', 'You do not have permission to access this page.')
    res.redirect('/account/login')
  }
}

/* ****************************************
 *  week 05 Account Management 
 *  Middleware For 
 *  authenticateToken
 * ************************************ */
Util.authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    req.flash('error', 'You need to login first.');
    return res.redirect('/account/login');
  }

  try {
    req.accountData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {
    req.flash('error', 'Invalid token. Please login again.');
    res.redirect('/account/login');
  }
}




module.exports = Util

//line 131: the mileage is formatted correctly with commas for thousands separators