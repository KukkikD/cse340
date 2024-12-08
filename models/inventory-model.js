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
 *  Get Vechicle details by inv_id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.inventory AS i 
      INNER JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1;`,
      [inv_id]
    )
    console.log(result.rows) // Check query result
    return result.rows[0] // Get single row result (car details)
  } catch (error) {
    console.error('Error getting vehicle by ID:', error)
    throw error
  }
}

/* ***************************
 *  Add new classification by name 
 * ************************** */
async function addClassification(classification_name) {
  if (!classification_name) {
    throw new Error("Classification name is required");
  }

  try {
    const sql =
      "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.error("Add Classification error:", error.message);
    throw error;
  }
}

/* ***************************
 *  Post new classification element in the server
 * ************************** */
async function addNewClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.error("Add New Classification error " + error.message)
  }
}

/* ***************************
 *  check exiting classification
 * ************************** */
function capitalize(str) { 
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); 
}  

async function checkExistingClassification(classification_name) { 
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification1 = await pool.query(sql, [classification_name.toLowerCase()])
    const classification2 = await pool.query(sql, [classification_name.toUpperCase()])
    const classification3 = await pool.query(sql, [capitalize(classification_name)])
    return classification1.rowCount + classification2.rowCount + classification3.rowCount
  } catch (error) { 
    console.error("Exiting Clasification error " + error.message);
  } 
}

/* ***************************
 *  Add new inventory (Vechicle)
 * ************************** */
async function addNewInventory(classification_id, inv_make, inv_model, inv_description, inv_image, 
  inv_thumbnail, inv_price, inv_year,  inv_miles, inv_color) {
  try {
    const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year,  inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, 
      inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
  } catch (error) {
    console.error("Add Now Vechicle error " + error.message)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, 
  checkExistingClassification, addNewClassification, addNewInventory};
