const filterGallery = () => {
  const hash = window.location.hash.slice(1) || "all";

  document.querySelectorAll("chip").forEach((chip) => {
    chip.classList.toggle("active", chip.getAttribute("data-filter") === hash);
  });

  document.querySelectorAll(".gallery-item").forEach((item) => {
    const category = item.dataset.category;
    item.classList.toggle("show", hash === "all" || hash === category);
  });
};

window.addEventListener("hashchange", filterGallery);
window.addEventListener("DOMContentLoaded", filterGallery);
