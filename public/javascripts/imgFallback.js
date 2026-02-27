document.addEventListener('DOMContentLoaded', () => {
  const fallback = '/images/no-image.png';

  document.querySelectorAll('img.campground-thumb').forEach((img) => {
    img.addEventListener('error', () => {
      if (img.src.endsWith(fallback)) return;
      img.src = fallback;
    });
  });
});