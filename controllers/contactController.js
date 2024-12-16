const contactModel = require("../models/contact-model")
const utilities = require("../utilities/")

/* ***************************
 * Show contact form
 * ************************** */
async function showContactForm(req, res) {
  try {
    let nav = await utilities.getNav();

    // ดึง account_id และ account_email จาก session
    const account_id = req.session.user?.account_id;
    const account_email = req.session.user?.account_email; // เปลี่ยนจาก account_email ตามชื่อที่ใช้ใน session

    res.render("contact/contactUs", {
      title: "Contact Us",
      nav,
      errors: null,
      account_id,     // ส่ง account_id ไปที่ EJS
      account_email,
      subject: '',    // เพิ่ม subject เป็นค่าว่าง
      message: '',  // ส่ง account_email ไปที่ EJS
    });
  } catch (error) {
    console.error("Error loading contact form:", error);
    req.flash("error", "An error occurred while loading the contact form.");
    res.redirect("/");
  }
}


 /* ***************************
 * Handle contact form submission
 * ************************** */
 async function handleContactSubmission(req, res) {
  const { subject, message } = req.body;
  const account_id = req.session.user?.account_id;
  const account_email = req.session.user?.account_email;

  if (!subject || !message || !account_email) {
    req.flash("notice", "All fields are required.");
    console.log('Session ID:', sid);
    console.log('Session Data:', sess);
    return res.render("contact/contactUs", {
      title: "Contact Us",
      nav: await utilities.getNav(),
      errors: null,
      account_id,
      account_email,
      subject: '',    // เพิ่ม subject เป็นค่าว่าง
      message: '',   // ส่ง message กลับไป
    });
  }

  try {
    await contactModel.saveContact(account_id, account_email, subject, message);
    req.flash("notice", "Your message has been sent successfully!");
    res.redirect("/contact/contactUs");
  } catch (error) {
    req.flash("error", "There was an error sending your message.");
    res.status(500).render("contact/contactUs", {
      title: "Contact Us",
      nav: await utilities.getNav(),
      errors: null,
      account_id,
      account_email,
      subject: '',    // เพิ่ม subject เป็นค่าว่าง
      message: '',   // ส่ง message กลับไป
    });
  }
}

  module.exports = { showContactForm, handleContactSubmission };
  