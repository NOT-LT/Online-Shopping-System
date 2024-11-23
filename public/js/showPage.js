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



  const shadowOverlay = document.getElementById('shadowOverlay');
  const shadowStatusDisplay = document.getElementById('shadowStatusDisplay');
  const addToCartForm = document.getElementById('addToCartForm');
  // if (addToCartForm) {
  //   addToCartForm.addEventListener('submit', (e) => {
  //     e.preventDefault();
  //     const formData = new FormData(addToCartForm);
  //     fetch('/shoppingCart', {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //       body: {
  //         itemId: formData.get('itemId'),
  //       },  
  //     })
  //       .then(res => res.json())
  //       .then(data => {
  //         if (JSON.stringify(data) === JSON.stringify({ status: 'OK' })) {
  //           shadowStatusDisplay.classList.toggle('opacity-0'); shadowStatusDisplay.classList.toggle('hidden');
  //           shadowOverlay.classList.toggle('hidden');
  //           setTimeout(() => {
  //             inquiryStatusDisplay.classList.toggle('opacity-0'); shadowStatusDisplay.classList.toggle('hidden');
  //             shadowOverlay.classList.toggle('hidden');
  //           }, 2000);
  //         } else {
  //           console.log("showPage.js err1: " + err);
  //           shadowStatusDisplay.innerHTML = `
  //             <div class="p-6">
  //               <h5 class="mb-2 text-lg font-medium leading-tight text-red-500">
  //                 There was an error performing your request.
  //               </h5>
  //             </div>
  //             <div class="border-t-2 border-neutral-100 px-6 py-3 text-surface/75 dark:border-white/10 dark:text-neutral-300">
  //               ${new Date().toLocaleString()}
  //             </div>
  //           `;
  //           shadowStatusDisplay.classList.toggle('opacity-0'); shadowStatusDisplay.classList.toggle('hidden');
  //           shadowOverlay.classList.toggle('hidden');
  //           setTimeout(() => {
  //             inquiryStatusDisplay.classList.toggle('opacity-0'); shadowStatusDisplay.classList.toggle('hidden');
  //             shadowOverlay.classList.toggle('hidden');
  //           }, 2000);

  //         }
  //       })
  //       .catch(err => {
  //         console.log("showPage.js err2: " + err);
  //         shadowStatusDisplay.innerHTML = `
  //         <div class="p-6">
  //           <h5 class="mb-2 text-lg font-medium leading-tight text-red-500">
  //             There was an error performing your request.
  //           </h5>
  //         </div>
  //         <div class="border-t-2 border-neutral-100 px-6 py-3 text-surface/75 dark:border-white/10 dark:text-neutral-300">
  //           ${new Date().toLocaleString()}
  //         </div>
  //       `;
  //         shadowStatusDisplay.classList.toggle('opacity-0'); shadowStatusDisplay.classList.toggle('hidden');
  //         shadowOverlay.classList.toggle('hidden');
  //         setTimeout(() => {
  //           inquiryStatusDisplay.classList.toggle('opacity-0'); shadowStatusDisplay.classList.toggle('hidden');
  //           shadowOverlay.classList.toggle('hidden');
  //         }, 2000);
  //       });
  //   });
  // }
})

