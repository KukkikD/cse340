const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  //req.flash("notice", "This is flash message!") // 
  res.render("index", {title: "Home", nav})
}

// Trigger Intentional Error
baseController.triggerError = async function (req, res, next) {
  const error = new Error("Intentional Error: This is a triggered 500 error.");
  error.status = 500;
  next(error); // Pass the error to the middleware
};


module.exports = baseController