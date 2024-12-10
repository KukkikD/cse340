// Event listener for updating account info
document.getElementById('updateInfoForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission to check for changes

  // Get current values from the form
  const currentFirstName = "<%= account_firstname %>";
  const currentLastName = "<%= account_lastname %>";
  const currentEmail = "<%= account_email %>";

  // Get new values entered by the user
  const firstName = document.getElementById('account_firstname').value;
  const lastName = document.getElementById('account_lastname').value;
  const email = document.getElementById('account_email').value;

  // Check if any value has changed
  if (firstName !== currentFirstName || lastName !== currentLastName || email !== currentEmail) {
    this.submit(); // Submit the form if changes are detected
  } else {
    alert("No changes detected. Please update at least one field.");
  }
});

// Event listener for updating password
document.getElementById('updatePasswordForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission to check for password validity

  const password = document.getElementById('account_password').value;

  // Validate password length and complexity
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/;
  if (passwordPattern.test(password)) {
    this.submit(); // Submit the form if the password is valid
  } else {
    alert("Password does not meet the complexity requirements.");
  }
});