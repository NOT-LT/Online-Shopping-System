const createItemForm = document.getElementById('createItemForm');
const createItemButton = document.getElementById('createItemButton');
console.dir(createItemForm)
createItemButton.disabled = true
createItemButton.classList.add('disableMe');
let allOK = false;

function whenUploaded(input) {
  const NofileElements = document.querySelectorAll(".Nofile");
  const FileUploadedElements = document.querySelectorAll(".FileUploaded");
  const FileNum = document.getElementById("fileNum");
  NofileElements.forEach(element => element.classList.add("hidden"));
  FileUploadedElements.forEach(element => element.classList.remove("hidden"));
  FileNum.textContent = input.files.length + " files selected";
}

Array.from(createItemForm.elements).forEach(x => {
  x.addEventListener('input', (event) => {
    if (x.tagName.toLowerCase() === 'input') {
      const value = x.value.trim();
      if (!value || !x.checkValidity()) {
        x.classList.add('invalid'); // Add red border to invalid inputs
        const errorSpan = x.nextElementSibling;
        if (errorSpan && errorSpan.tagName === 'SPAN') {
          errorSpan.classList.remove('hidden');
        }
      } else {
        x.classList.remove('invalid'); // Remove red border from valid inputs
        const errorSpan = x.nextElementSibling;
        if (errorSpan && errorSpan.tagName === 'SPAN') {
          errorSpan.classList.add('hidden');
        }
      }
    }
    allOK = true;
    Array.from(createItemForm.elements).forEach(element => {
      if (!(element.checkValidity())) {
        allOK = false;
        createItemButton.disabled = true
        createItemButton.classList.add('disableMe');
      }



    })
    if (allOK) {
      createItemButton.disabled = false
      createItemButton.classList.remove('disableMe');
    } else {
      createItemButton.disabled = true
      createItemButton.classList.add('disableMe');
    }

  })
});


document.getElementById('createItemForm').addEventListener('submit', function (event) {
  let formIsValid = true;
  Array.from(this.elements).forEach(element => {
    if (!element.checkValidity()) {
      formIsValid = false;
      element.classList.add('border-red-600'); // Add red border to invalid inputs
      // Show a custom error message
      const errorSpan = element.nextElementSibling;
      if (errorSpan && errorSpan.tagName === 'SPAN') {
        errorSpan.classList.remove('hidden');
      }
    } else {
      element.classList.remove('border-red-600'); // Remove red border from valid inputs
      const errorSpan = element.nextElementSibling;
      if (errorSpan && errorSpan.tagName === 'SPAN') {
        errorSpan.classList.add('hidden');
      }
    }
  });

  if (!formIsValid) {
    event.preventDefault(); // Cancel form submission
    console.log('Form submission canceled due to invalid inputs.');
  } else {
    console.log('Form is valid. Submitting...');
  }
});
