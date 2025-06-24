// Mobile Menu Toggle (unchanged)
function toggleMenu() {
  const navLinks = document.getElementById("nav-links");
  navLinks.classList.toggle("active");
}

/* ───────── VIDEO LIGHTBOX ───────── */
let currentVideoIndex = 0;                 // ◀ NEW (tracks position)

/* Build an ordered list of all video sources on the page   */
/* Assumes each thumb contains <video src="…">               */
const videoThumbs = document.querySelectorAll(".video-thumb video");
const videos = Array.from(videoThumbs).map((v) => v.getAttribute("src"));

function openLightbox(videoSrc) {
  const lightbox      = document.getElementById("video-lightbox");
  const lightboxVideo = document.getElementById("lightbox-video");

  currentVideoIndex = videos.indexOf(videoSrc); // ◀ NEW
  if (currentVideoIndex === -1) currentVideoIndex = 0;

  lightboxVideo.src = videoSrc;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";

  // Push a history entry so first Back only closes the lightbox
  history.pushState({ lightbox: true }, "", `#${fileName(videoSrc)}`); // ◀ CHG
}

function closeLightbox() {
  const lightbox      = document.getElementById("video-lightbox");
  const lightboxVideo = document.getElementById("lightbox-video");

  lightboxVideo.pause();
  lightboxVideo.currentTime = 0;
  lightbox.classList.remove("active");
  document.body.style.overflow = "auto";

  // Remove hash & sync history
  if (history.state && history.state.lightbox) history.back();        // ◀ NEW
}

/* ───── NAVIGATION (NEW) ───── */
function showVideo(index) {
  currentVideoIndex = (index + videos.length) % videos.length;
  const src = videos[currentVideoIndex];
  const vid = document.getElementById("lightbox-video");
  vid.src = src;
  vid.play();
  history.replaceState({ lightbox: true }, "", `#${fileName(src)}`);
}

function prevVideo() { showVideo(currentVideoIndex - 1); }
function nextVideo() { showVideo(currentVideoIndex + 1); }

/* ───────── HELPERS ───────── */
function fileName(path) {
  return path.split("/").pop().split(".")[0];
}

/* ───────── EVENT LISTENERS ───────── */
document.addEventListener("DOMContentLoaded", () => {
  /* ESC to close */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* Click-outside closes */
  const lightbox = document.getElementById("video-lightbox");
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* Browser Back / swipe-back */
  window.addEventListener("popstate", () => {
    if (lightbox.classList.contains("active")) closeLightbox();
  });

  /* Open lightbox if URL already has a hash (deep-linked video) */
  if (window.location.hash) {
    const id = window.location.hash.substring(1);
    const fullSrc = videos.find((v) => fileName(v) === id);
    if (fullSrc) openLightbox(fullSrc);
  }

  /* Pre-load first thumb (unchanged) */
  if (videoThumbs[0]) videoThumbs[0].preload = "metadata";
});
