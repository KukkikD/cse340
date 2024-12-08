//week05 : update step 2 activity : for edit-inventory
//this funtion will not allow the "Update" button from executing unless some data has changed. 
const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button")
      updateBtn.removeAttribute("disabled")
    })