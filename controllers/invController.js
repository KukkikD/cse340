const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    if (!data || data.length === 0) {
      throw new Error("Classification not found")
    }
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (err) {
    next(err) // send to error handler
  }
}

/* ***************************
 *  Build vehicle details view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  try {
    const vehicle_id = req.params.vehicleId
    const vehicleData = await invModel.getVehicleById(vehicle_id)

     // ตรวจสอบว่า vehicleData มีข้อมูลหรือไม่
    if (!vehicleData) {
    const err = new Error("Vehicle not found")
    err.status = 404
    return next(err)  // ถ้าไม่พบข้อมูลให้ส่งไปที่ error handler
    }
    
    const nav = await utilities.getNav()
    const details = utilities.buildVehicleDetails(vehicleData)
    res.render("./inventory/vehicle-details", {
      title: `${vehicleData.inv_year || "Unknown Year"} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      details, // send to HTML
    })
  } catch (err) {
    next(err) // // send to error handler
  }
}


module.exports = invCont