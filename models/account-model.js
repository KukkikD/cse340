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
*   Return account data using id
* *************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_firstname, account_lastname, account_email FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching info found")
  }
}

/* ***************************
 *  Update account info Data
 * ************************** */
async function updateInfoData(
  account_id,
  account_firstname,
  account_lastname, 
  account_email
) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Update account password Data
 * ************************** */
async function updatePassword(
  account_id,
  account_password
) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const data = await pool.query(sql, [
      account_password,
      account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, loginAccount, getAccountById, updateInfoData, updatePassword};
