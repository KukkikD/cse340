document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      if (input.checkValidity()) {
        input.classList.add("valid");
        input.classList.remove("invalid");
      } else {
        input.classList.add("invalid");
        input.classList.remove("valid");
      }
    });
  });

  document.querySelector(".register").addEventListener("submit", function(event) {
    const passwordField = document.getElementById("account_password");
    
    // check password that math pattern or not
    if (!passwordField.value.match(passwordField.pattern)) {
      event.preventDefault(); // stop to send from 
      alert("Password does not meet the required criteria!");
    }
  });