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
    //req.flash("notice", "This is flash message!") // 
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

     // check vehicleData 
    if (!vehicleData) {
    const err = new Error("Vehicle not found")
    err.status = 404
    return next(err)  // send to error handler
    }
    
    const nav = await utilities.getNav()
    const details = utilities.buildVehicleDetails(vehicleData)
    //req.flash("notice", "This is flash message!") // 
    res.render("./inventory/vehicle-details", {
      title: `${vehicleData.inv_year || "Unknown Year"} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      details, // send to HTML
    })
  } catch (err) {
    next(err) // // send to error handler
  }
}

/* ***************************
 * Week 04 : activity
 *  Build Inventory Management View
 * ************************** */
invCont.renderManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.chooseClassification()
    //req.flash("notice", "Inventory management loaded successfully!") 
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors:null,
      classificationSelect,
    })
  } catch (err) {
    next(err) // Pass error to the error handler
  }
}

/* ***************************
 *  Build new classification view
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const nav = await utilities.getNav()
  //req.flash("notice", "This is a flash message")
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process new classification 
 * ************************** */
invCont.addNewClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const classificationSelect = await utilities.chooseClassification()
  const addResult = await invModel.addNewClassification(
    classification_name
  )
  if (addResult) {
    req.flash(
      "notice", 
      `The ${classification_name} classification was added successfully.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management", 
      nav: await utilities.getNav(),  
      errors:null,    
      classificationSelect,
    })

  } else {
    req.flash(
      "notice", 
      "Sorry! the classification was not added."
    )

    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification", 
      nav: await utilities.getNav(),
      errors: null,      
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const typeSelector = await utilities.chooseClassification()
  //req.flash("notice", "This is a flash message")
  res.render("./inventory/add-inventory", {
    title: "Add New Vechicle",
    nav,
    typeSelector,
    errors: null,
  })
}

/* ***************************
 *  Process Add new inventory 
 * ************************** */
invCont.addNewInventory = async function (req, res, next) {
  const nav = await utilities.getNav()

 /* let typeSelector
  try {
    // Use a function to create a dropdown for selecting types.
    typeSelector = await utilities.chooseClassification()
  } catch (error) {
    console.error("Error creating typeSelector:", error)
  } */

  const { classification_id, inv_make, inv_model, inv_description, inv_image, 
    inv_thumbnail, inv_price, inv_year,  inv_miles, inv_color } = req.body

  const classificationSelect = await utilities.chooseClassification()

  const addResult = await invModel.addNewInventory(
    classification_id, inv_make, inv_model, inv_description, inv_image, 
      inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)

  if (addResult) {
    req.flash(
      "notice", 
      "The new vehicle was added successfully."
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management", 
      nav,
      errors: null,
      classificationSelect,
    })

  } else {
    req.flash(
      "notice", 
      "The new vehicle was not added."
    )
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory", 
      nav,
      //typeSelector, // Pass the typeSelector variable to the view.
      errors: null,     
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  console.log(itemData) //ตรวจสอบข้อมูบ Classification ID
  const typeSelector = await utilities.chooseClassification(itemData.classification_id)
  console.log(itemData.classification_id) //check the data
  const itemName = `${itemData[0].inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: typeSelector,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    errors: null,
  })
}


module.exports = invCont