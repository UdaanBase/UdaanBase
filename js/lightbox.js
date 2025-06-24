document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Grab elements ---------- */
  const modal      = document.querySelector(".lightbox-modal");
  const img        = document.querySelector(".lightbox-image");
  const caption    = document.querySelector(".lightbox-caption");
  const btnClose   = document.querySelector(".lightbox-close");
  const btnPrev    = document.querySelector(".lightbox-prev");
  const btnNext    = document.querySelector(".lightbox-next");
  const gallery    = document.querySelectorAll(".gallery-item a");

  /* ---------- State ---------- */
  let current = 0;
  const slides = Array.from(gallery).map((a) => ({
    src:   a.getAttribute("href"),
    title: a.dataset.title || ""
  }));

  /* ---------- Helpers ---------- */
  const showSlide = (n) => {
    current          = (n + slides.length) % slides.length;
    img.src          = slides[current].src;
    caption.textContent = slides[current].title;
  };

  const open = (idx) => {
    showSlide(idx);
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    /* Push a state so the first Back closes the lightbox */
    history.pushState({ lightbox: true }, "", "");
  };

  const close = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    /* If the current history entry was added by us, go back once
       so the Back button behaviour stays intuitive.            */
    if (history.state && history.state.lightbox) history.back();
  };

  const prev = () => showSlide(current - 1);
  const next = () => showSlide(current + 1);

  /* ---------- Event wiring ---------- */
  gallery.forEach((a, i) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      open(i);
    });
  });

  btnClose.addEventListener("click", close);
  btnPrev .addEventListener("click", prev );
  btnNext .addEventListener("click", next );

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  /* ─ Keyboard */
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft")  prev();
    if (e.key === "ArrowRight") next();
  });

  /* ─ Browser Back / swipe-back */
  window.addEventListener("popstate", () => {
    if (modal.classList.contains("active")) close();
  });

  /* ---------- Double-tap / double-click zoom ---------- */
  let lastTap = 0;
  let zoomed  = false;

  const toggleZoom = (x, y) => {
    zoomed = !zoomed;
    if (zoomed) {
      /* centre zoom on tap point */
      const rect = img.getBoundingClientRect();
      const ox   = ((x - rect.left) / rect.width ) * 100;
      const oy   = ((y - rect.top ) / rect.height) * 100;
      img.style.transformOrigin = `${ox}% ${oy}%`;
      img.style.transform       = "scale(2)";
      img.style.cursor          = "zoom-out";
    } else {
      img.style.transform = "scale(1)";
      img.style.cursor    = "zoom-in";
    }
  };

  /* Mobile double-tap */
  img.addEventListener("touchend", (e) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      const touch = e.changedTouches[0];
      toggleZoom(touch.clientX, touch.clientY);
      e.preventDefault();
    }
    lastTap = now;
  });

  /* Desktop double-click */
  img.addEventListener("dblclick", (e) => {
    toggleZoom(e.clientX, e.clientY);
  });
});
