let allOkEdit = false;
const editItemForm = document.getElementById('editItemForm');
const editItemButton = document.getElementById('editItemButton');
editItemButton.disabled = false
Array.from(editItemForm.elements).forEach(x => {
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
    allOkEdit = true;
    Array.from(editItemForm.elements).forEach(element => {
      if (!(element.checkValidity())) {
        allOkEdit = false;
        editItemButton.disabled = true
        editItemButton.classList.add('disableMe');
      }

    })
    if (allOkEdit) {
      editItemButton.disabled = false
      editItemButton.classList.remove('disableMe');
    } else {
      editItemButton.disabled = true
      editItemButton.classList.add('disableMe');
    }

  })
});

document.getElementById('editItemForm').addEventListener('submit', function (event) {
  let formIsValid = true;
  Array.from(this.elements).forEach(element => {
    if (!element.checkValidity()) {
      formIsValid = false;
      element.classList.add('border-red-600'); // Add red border to invalid inputs
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

const deletedImages = document.getElementById('deletedImgs');
document.getElementById('uploadInput').addEventListener('change', function (e) {
  const files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    if (files[i]) {
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = function (e) {
        addImage(e.target.result);
      };
    }
  }
});

function removeImage(button) {
  // Add the image to the deleted images
  deletedImages.value += (button.previousElementSibling.getAttribute('data-img-name')) + ',';

  // Remove the image element from the DOM
  button.parentElement.remove();

  // Remove the corresponding file from the upload input
  const uploadInput = document.getElementById('uploadInput');
  const dataTransfer = new DataTransfer();

  // Iterate over the files and add them to the DataTransfer object, except the one to be removed
  for (let i = 0; i < uploadInput.files.length; i++) {
    const file = uploadInput.files[i];
    if (file.name !== button.previousElementSibling.getAttribute('data-img-name')) {
      dataTransfer.items.add(file);
    }
  }
  // Update the input's files with the new DataTransfer object
  uploadInput.files = dataTransfer.files;
}

function addImage(src) {
  const uploadInput = document.getElementById('uploadInput')
  const imageContainer = document.querySelector('.flex.flex-row.overflow-x-auto.relative.mt-2');
  if (imageContainer) {
    const newImage = document.createElement('div');
    newImage.classList.add('relative', 'w-28', 'h-28', 'mr-2', 'flex-shrink-0');
    newImage.innerHTML = `
              <img src="${src}" alt="Item Image" data-img-name="${uploadInput.files[uploadInput.files.length - 1].name}" class="w-full h-full object-cover rounded-md">
          <button type="button" class="absolute top-1 bg-opacity-85 right-1 bg-red-500 text-white rounded-full p-1"
            onclick="removeImage(this)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
            `;
    imageContainer.appendChild(newImage);
  }
}
