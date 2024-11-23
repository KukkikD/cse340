const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name") /* bugging from public.classification ORDER BY classification_name */
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get Vechicle details by classification_id
 * ************************** */
async function getVehicleById(id) {
  try {
    const result = await pool.query(
      `SELECT 
         inv_id, inv_make, inv_model, inv_year, inv_description, 
         inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
         classification.classification_name
       FROM inventory 
       INNER JOIN classification 
       ON inventory.classification_id = classification.classification_id
       WHERE inv_id = $1`, 
      [id]
    )
    return result.rows[0] // Get single row result (car details)
  } catch (error) {
    console.error('Error getting vehicle by ID:', error)
    throw error
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById};
