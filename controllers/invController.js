const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle details view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
    const vehicle_id = req.params.vehicleId
    const vehicleData = await invModel.getVehicleById(vehicle_id)
    const nav = await utilities.getNav()
    const details = utilities.buildVehicleDetails(vehicleData)
    res.render("./inventory/vehicle-details", {
      title: `${vehicleData.inv_year || "Unknown Year"} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      details, // sent to HTML for result
    })
}


module.exports = invCont
