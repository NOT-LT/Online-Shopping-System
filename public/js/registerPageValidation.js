let allOkEdit = false;
const registerationForm = document.getElementById('registerationForm');
const registerationButton = document.getElementById('registerationButton');
registerationButton.disabled = false
Array.from(registerationForm.elements).forEach(x => {
  x.addEventListener('input', (event) => {
    if (x.tagName.toLowerCase() === 'input') {
      const value = x.value.trim();
      if (!value || !x.checkValidity()) {
        x.classList.add('invalid'); // Add red border to invalid inputs
      } else {
        x.classList.remove('invalid'); // Remove red border from valid inputs
      }
    }
    allOkEdit = true;
    Array.from(registerationForm.elements).forEach(element => {
      if (!(element.checkValidity())) {
        allOkEdit = false;
        registerationButton.disabled = true
        registerationButton.classList.add('disableMe');
      }

    })
    if (allOkEdit) {
      registerationButton.disabled = false
      registerationButton.classList.remove('disableMe');
    } else {
      registerationButton.disabled = true
      registerationButton.classList.add('disableMe');
    }

  })
});

document.getElementById('registerationForm').addEventListener('submit', function (event) {
  let formIsValid = true;
  Array.from(this.elements).forEach(element => {
    if (!element.checkValidity()) {
      formIsValid = false;
      element.classList.add('border-red-600'); // Add red border to invalid inputs
    } else {
      element.classList.remove('border-red-600'); // Remove red border from valid inputs
    }
  });

  if (!formIsValid) {
    event.preventDefault(); // Cancel form submission
    console.log('Form submission canceled due to invalid inputs.');
  } else {
    console.log('Form is valid. Submitting...');
  }
});