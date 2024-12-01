const inventoryModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
*  Add Classification Rule
* ********************************* */
validate.addClassificationRules = () => {
    return [
        body("classification_name")
            .isAlpha()
            .withMessage("Please provide a valid name.") // on error this message is sent.
            .notEmpty()
            .custom(async (classification_name) => {
                const classExists = await inventoryModel.checkExistingClassification(classification_name)
                if (classExists){
                  throw new Error("Classification already exists. Please enter a new classification.")
                }
              }),
        ]
}

/*  **********************************
*  Check Classification Data 
* ********************************* */
validate.checkClassificationData = async (req, res, next) => {
    let errors = []
    const { classification_name } = req.body
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
   
      })
      return
    }
    next()
}

/*  **********************************
*  Add Inventory  Rules
* ********************************* */
validate.addInventoryRules = () => {
    return [
       body("classification_id")
            .isInt()
            .notEmpty()
            .withMessage("Please Choose a Classification List."), 

        body("inv_make")
            .notEmpty()
            .withMessage("Please provide a Make."),
            
        body("inv_model")
            .notEmpty()
            .withMessage("Please provide a Model."),

        body("inv_description")
            .notEmpty()
            .withMessage("Please provide Description."),

        body("inv_image")
            .notEmpty(),

        body("inv_thumbnail")
            .notEmpty(),    
            
        body("inv_year")
            .isInt()
            .notEmpty()
            .withMessage("Please provide Year."),
        
        body("inv_miles")
            .isInt()
            .notEmpty()
            .withMessage("Please provide Miles."),

        body("inv_color")
            .isAlpha()
            .notEmpty()
            .withMessage("Please provide a Color.")
        
    ]
}

/* ******************************
 * Check add inventory data
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {

    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year,  inv_miles, inv_color } = req.body

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const typeSelector = await utilities.chooseClassification()
      res.render("./inventory/add-inventory", {
        errors,
        title: "Add New Vechicle",
        typeSelector,
        nav,
        classification_id, 
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year,  
        inv_miles, 
        inv_color,
      })
      return
    }
    next()
}


module.exports = validate