// Check if the browser supports smooth scrolling
if (!('scrollBehavior' in document.documentElement.style)) {
  // If not, add smooth scrolling behavior using JavaScript
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
}