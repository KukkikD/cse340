const pool = require("../database")

/* ***************************
 * Week06: Final Enhancement
 * Save contact message to the database
 * ************************** */
async function saveContact(account_id, account_email, subject, message) {
  const sql = `INSERT INTO contact (account_id, account_email, subject, message) 
               VALUES ($1, $2, $3, $4) RETURNING *`
  try {
    const result = await pool.query(sql, [account_id, account_email, subject, message])
    return result.rows[0]
  } catch (error) {
    console.error("Error saving contact message:", error)
    throw error
  }
}

module.exports = { saveContact };
