/* Shared carousel helper (uses jQuery for directory listing parsing) */

(function () {
  "use strict";

  const popup = document.getElementById("carousel-popup");
  const indicators = document.getElementById("carousel-indicators");
  const itemHolder = document.getElementById("itemHolder");

  function clearCarousel() {
    if (!indicators || !itemHolder) return;

    while (indicators.firstChild) {
      indicators.removeChild(indicators.firstChild);
    }

    while (itemHolder.firstChild) {
      itemHolder.removeChild(itemHolder.firstChild);
    }
  }

  function buildCarousel(images) {
    if (!images || !images.length || !indicators || !itemHolder) return;

    images.forEach((src, index) => {
      const item = document.createElement("div");
      item.classList.add("item");
      if (index === 0) item.classList.add("active");

      const img = document.createElement("img");
      img.classList.add("img-fluid");
      img.src = src;
      item.appendChild(img);

      itemHolder.appendChild(item);

      const li = document.createElement("li");
      li.setAttribute("data-target", "carousel-popup");
      li.setAttribute("data-slide-to", String(index));
      if (index === 0) li.classList.add("active");
      indicators.appendChild(li);
    });
  }

  function createCarousel(folderId) {
    if (!folderId) return;

    const folderUrl = "/images/" + folderId;
    const images = [];

    $.ajax({
      url: folderUrl,
      success(data) {
        $(data)
          .find("a")
          .attr("href", (i, val) => {
            if (val && val.match(/\.(jpe?g|png|gif)$/i)) {
              images.push(val);
            }
          });

        if (images.length) {
          buildCarousel(images);
          if (popup) popup.style.display = "block";
        }
      },
    });
  }

  window.carouselMaker = function (source) {
    clearCarousel();
    if (!source || !source.id) return;
    createCarousel(source.id);
  };

  function hidePopup() {
    clearCarousel();
    if (popup) popup.style.display = "none";
  }

  if (popup) {
    popup.ondblclick = hidePopup;
  }

  const closeButton = document.getElementById("close");
  if (closeButton) {
    closeButton.onclick = hidePopup;
  }
})();

