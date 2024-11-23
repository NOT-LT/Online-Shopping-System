const burgerBtn = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');
burgerBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');

  setTimeout(() => {
    mobileMenu.classList.toggle('show');
  }, 10);
});

const cartButton = document.getElementById('cart-button');
const cartDropdownMenu = document.getElementById('cart-dropdown-menu');

cartButton.addEventListener('click', () => {
  cartDropdownMenu.classList.toggle('hidden');
  cartDropdownMenu.classList.toggle('opacity-0');
});

const cartQuantities = document.querySelectorAll('.cart-quantity');
cartQuantities.forEach(input => {
  input.addEventListener('change', (event) => {
    const itemId = event.target.getAttribute('data-item-id');
    const newQuantity = event.target.value;
    updateCart(itemId, newQuantity);
  });
});

function updateCart(itemId, newQuantity) {
  let cart = getCartFromCookies();
  cart = cart.map(item => {
    if (item._id === itemId) {
      item.quantity = newQuantity;
    }
    return item;
  });
  setCartInCookies(cart);
}

function getCartFromCookies() {
  const cartCookie = document.cookie.split('; ').find(row => row.startsWith('shoppingCart='));
  return cartCookie ? JSON.parse(decodeURIComponent(cartCookie.split('=')[1])) : [];
}

function setCartInCookies(cart) {
  document.cookie = `shoppingCart=${encodeURIComponent(JSON.stringify(cart))}; path=/; max-age=31536000`;
}


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