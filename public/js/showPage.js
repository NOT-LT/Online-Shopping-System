document.addEventListener('DOMContentLoaded', (event) => {
  const images = document.querySelectorAll('[id^="image"]'); // CSS Atrribute selector
  const indicators = document.querySelectorAll('[id^="indicator"]');
  let currentIndex = 0;

  const showImage = (index) => {
    images.forEach((img, i) => {
      if (i === index) {
        img.classList.remove('hidden');
        img.classList.add('opacity-100');
        indicators[i].classList.add('bg-white');
        indicators[i].classList.remove('bg-gray-400');
      } else {
        img.classList.add('hidden');
        img.classList.remove('opacity-100');
        indicators[i].classList.remove('bg-white');
        indicators[i].classList.add('bg-gray-400');
      }
    });
  };

  const nextImage = () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  };

  const prevImage = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  };

  document.getElementById('next').addEventListener('click', nextImage);
  document.getElementById('prev').addEventListener('click', prevImage);

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => showImage(index));
  });

  showImage(currentIndex);


  const inquiryForm = document.getElementById('inquiryForm');
  const inquiryMsgInput = document.getElementById('inquiryMsg');
  const inquiryMsgTitle = document.getElementById('inquiryTitle');

  let inquiryMsgFullname = '', inquiryMsgPhoneNumber = '', inquiryMsgEmail = '';
  if (document.getElementById('inquiryFullName') != null) {
    try {
      inquiryMsgFullname = document.getElementById('inquiryFullName');
      inquiryMsgPhoneNumber = document.getElementById('inquiryPhoneNumber');
      inquiryMsgEmail = document.getElementById('inquiryEmail');
    } catch (error) {
    }
  }
 


  const inquiryOverlay = document.getElementById('inquiryOverlay');
  const inquiryStatusDisplay = document.getElementById('inquiryStatusDisplay');
  inquiryForm?.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    const itemId = inquiryForm?.getAttribute("data-item-id");
    console.log("inquiryMsgFullname: ", inquiryMsgFullname?.value);
    fetch(`/properties/${itemId}/inquiry`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inquiry: {
          title: inquiryMsgTitle?.value,
          body: inquiryMsgInput?.value,
          fullName: inquiryMsgFullname?.value,
          email: inquiryMsgEmail?.value,
          phoneNumber: inquiryMsgPhoneNumber?.value
        }
      })
    })
      .then(response => {
        if (!response.ok) {
          console.log("Network or other error");
          // Network or other error
          inquiryStatusDisplay.innerHTML = `
  <div class="p-6">
    <h5 class="mb-2 text-lg font-medium leading-tight text-red-500">
      There was an error sending your inquiry.
    </h5>
  </div>
  <div class="border-t-2 border-neutral-100 px-6 py-3 text-surface/75 dark:border-white/10 dark:text-neutral-300">
    ${new Date().toLocaleString()}
  </div>
`;
          inquiryStatusDisplay.classList.toggle('opacity-0'); inquiryStatusDisplay.classList.toggle('hidden');
          inquiryOverlay.classList.toggle('hidden');
          setTimeout(() => {
            inquiryStatusDisplay.classList.toggle('opacity-0'); inquiryStatusDisplay.classList.toggle('hidden');
            inquiryOverlay.classList.toggle('hidden');
          }, 2000);
        } else {
          return response.json();
        }
      }).then(data => {
        if (JSON.stringify(data) === JSON.stringify({ status: 'OK' })) {
          inquiryStatusDisplay.classList.toggle('opacity-0'); inquiryStatusDisplay.classList.toggle('hidden');
          inquiryOverlay.classList.toggle('hidden');
          setTimeout(() => {
            inquiryStatusDisplay.classList.toggle('opacity-0'); inquiryStatusDisplay.classList.toggle('hidden');
            inquiryOverlay.classList.toggle('hidden');
          }, 2000);

        }
      })
      .catch(error => {
        // Network or other error
        inquiryStatusDisplay.innerHTML = `
  <div class="p-6">
    <h5 class="mb-2 text-lg font-medium leading-tight text-red-500">
      There was an error sending your inquiry.
    </h5>
  </div>
  <div class="border-t-2 border-neutral-100 px-6 py-3 text-surface/75 dark:border-white/10 dark:text-neutral-300">
    ${new Date().toLocaleString()}
  </div>
`;
        inquiryStatusDisplay.classList.toggle('opacity-0'); inquiryStatusDisplay.classList.toggle('hidden');
        inquiryOverlay.classList.toggle('hidden');
        setTimeout(() => {
          inquiryStatusDisplay.classList.toggle('opacity-0'); inquiryStatusDisplay.classList.toggle('hidden');
          inquiryOverlay.classList.toggle('hidden');
        }, 2000);
      });
  });
})

