const burgerBtn = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');
burgerBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');

  setTimeout(() => {
    mobileMenu.classList.toggle('show');
  }, 10);
});



const profileDropdownMenu = document.getElementById('profile-dropdown-menu');
const userMenuButton = document.getElementById('user-menu-button');

userMenuButton?.addEventListener('click', async (event) => {
  if (profileDropdownMenu.classList.contains('hidden')) {
    profileDropdownMenu.classList.toggle('hidden');
    setTimeout(() => {
      profileDropdownMenu.classList.toggle('opacity-0');
    }, 10);
  } else {
    profileDropdownMenu.classList.toggle('opacity-0');

    // Wait for the transition to complete
    setTimeout(() => {
      profileDropdownMenu.classList.toggle('hidden');
    }, 200);
  }

})