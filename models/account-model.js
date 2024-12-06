const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for account information from DB
 * ********************* */
async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    return result.rows[0]; 
  } catch (error) {
    throw new Error(error.message);
  }
}

/* *****************************
*   Account Login 
* *************************** */
async function loginAccount(account_email, account_password) {
  try {const sql = "SELECT * FROM account WHERE account_email = $1"; 
    const result = await pool.query(sql, [account_email]); 
    if (result.rows.length > 0) { 
      const user = result.rows[0];
      const match = await bcrypt.compare(account_password, user.account_password);
      if (match) { 
        return true;
      } else { 
        return false;
      } 
      }
    } catch (error) { 
      console.log(error)
      return error.message; 
    } 
  }

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}


module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, loginAccount};
