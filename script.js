document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Carousel
  const track = document.getElementById('carousel-track');
  const slides = track.querySelectorAll('.carousel-slide');
  const dotsContainer = document.getElementById('carousel-dots');
  let currentSlide = 0;

  slides.forEach(function(_, i) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', function() { goToSlide(i); });
    dotsContainer.appendChild(dot);
  });

  function goToSlide(n) {
    currentSlide = ((n % slides.length) + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    dotsContainer.querySelectorAll('.carousel-dot').forEach(function(d, i) {
      d.classList.toggle('active', i === currentSlide);
    });
    document.getElementById('carousel-counter').textContent = (currentSlide + 1) + ' / ' + slides.length;
  }

  document.getElementById('carousel-prev').addEventListener('click', function() { goToSlide(currentSlide - 1); });
  document.getElementById('carousel-next').addEventListener('click', function() { goToSlide(currentSlide + 1); });

  // Touch swipe
  var touchStartX = 0;
  var carouselEl = document.getElementById('carousel');
  carouselEl.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; });
  carouselEl.addEventListener('touchend', function(e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(currentSlide + 1);
      else goToSlide(currentSlide - 1);
    }
  });


  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbCounter = document.getElementById('lb-counter');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentIndex = 0;

  const images = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt,
    caption: item.querySelector('.gallery-overlay span')?.textContent || ''
  }));

  function showImage(index) {
    currentIndex = ((index % images.length) + images.length) % images.length;
    lbImg.src = images[currentIndex].src;
    lbImg.alt = images[currentIndex].alt;
    lbCaption.textContent = images[currentIndex].caption;
    lbCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, i) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => openLightbox(i));
  });

  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
  document.getElementById('lb-next').addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
});
