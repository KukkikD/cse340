document.addEventListener('DOMContentLoaded', () => {
    const formInfo = document.querySelector("#updateInfo");
    const formPsw = document.querySelector("#updatePassword");
  
    if (formInfo) {
      const updateBtn = formInfo.querySelector('button');
      updateBtn.removeAttribute("disabled"); // always work
    }
  
    if (formPsw) {
      const updateBtn = formPsw.querySelector('button');
      updateBtn.removeAttribute("disabled"); // always work
    }
  });
