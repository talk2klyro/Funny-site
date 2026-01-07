// ===========================
// APP.JS – OPTIMIZED VIDEO-FIRST POSTS
// ===========================

document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------
  // 🔒 ACCESS CONTROL
  // ---------------------------
  if (sessionStorage.getItem("hasAccess") !== "true") {
    window.location.href = "gate.html";
    return;
  }

  // ---------------------------
  // DOM REFERENCES
  // ---------------------------
  const grid =
    document.getElementById("posts-container") ||
    document.getElementById("grid");

  const searchInput = document.getElementById("searchInput");
  const openAffiliateModal = document.getElementById("openAffiliateModal");
  const affiliateModal = document.getElementById("affiliateModal");
  const closeModalBtn = document.querySelector(".close-modal");

  if (!grid) return;

  let posts = [];

  // ---------------------------
  // VIDEO URL → EMBED URL
  // ---------------------------
  function getEmbedUrl(url) {
    if (!url) return "";

    if (url.includes("youtube.com/watch")) {
      const id = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }

    if (url.includes("youtube.com/shorts")) {
      const id = url.split("/shorts/")[1];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }

    if (url.includes("instagram.com")) {
      return `${url}embed`;
    }

    if (url.includes("tiktok.com")) {
      return `${url}?embed=1`;
    }

    if (url.includes("facebook.com")) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        url
      )}&autoplay=true`;
    }

    return url;
  }

  // ---------------------------
  // RENDER POSTS
  // ---------------------------
  function render(data) {
    grid.innerHTML = "";

    data.forEach(post => {
      const postDiv = document.createElement("article");
      postDiv.className = "post";

      postDiv.innerHTML = `
        <h2>${post.title}</h2>
        ${post.description ? `<p>${post.description}</p>` : ""}
      `;

      const cardsWrapper = document.createElement("div");
      cardsWrapper.className = "cards-wrapper";

      (post.cards || []).forEach(card => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";

        // ---------------------------
        // VIDEO CARD (THUMBNAIL FIRST)
        // ---------------------------
        if (card.type === "video") {
          const preview = document.createElement("div");
          preview.className = "video-preview";
          preview.innerHTML = `
            <img src="${card.thumbnail}" alt="${card.title}" loading="lazy" />
            <div class="play-overlay">▶</div>
          `;

          preview.addEventListener("click", () => {
            preview.innerHTML = `
              <iframe
                src="${getEmbedUrl(card.video)}"
                frameborder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowfullscreen
              ></iframe>
            `;
          });

          cardDiv.appendChild(preview);
        }

        // ---------------------------
        // TEXT CARD
        // ---------------------------
        if (card.type === "text") {
          cardDiv.innerHTML += `
            <h3>${card.title}</h3>
            <p>${card.text}</p>
          `;
        }

        cardsWrapper.appendChild(cardDiv);
      });

      postDiv.appendChild(cardsWrapper);

      // ---------------------------
      // ACTION BUTTONS
      // ---------------------------
      const actions = document.createElement("div");
      actions.className = "post-actions";

      const commentBtn = document.createElement("button");
      commentBtn.className = "btn-comment";
      commentBtn.textContent = "Comment";
      commentBtn.addEventListener("click", () => {
        window.open(
          "https://whatsapp.com/channel/0029Vb77PdM6LwHtxQS6u638",
          "_blank"
        );
      });

      actions.appendChild(commentBtn);
      postDiv.appendChild(actions);
      grid.appendChild(postDiv);
    });
  }

  // ---------------------------
  // LOAD DATA
  // ---------------------------
  async function loadPosts() {
    try {
      const res = await fetch("data.json");
      const json = await res.json();
      posts = Array.isArray(json.posts) ? json.posts : [];
      render(posts);
    } catch (err) {
      console.error("Failed to load data.json", err);
      grid.innerHTML =
        "<p style='color:red'>Failed to load content.</p>";
    }
  }

  loadPosts();

  // ---------------------------
  // SEARCH
  // ---------------------------
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const q = e.target.value.toLowerCase();
      render(
        posts.filter(p =>
          p.title.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
        )
      );
    });
  }

  // ---------------------------
  // AFFILIATE MODAL
  // ---------------------------
  if (openAffiliateModal && affiliateModal && closeModalBtn) {
    const closeModal = () => {
      affiliateModal.classList.add("hidden");
      affiliateModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    openAffiliateModal.addEventListener("click", () => {
      affiliateModal.classList.remove("hidden");
      affiliateModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });

    closeModalBtn.addEventListener("click", closeModal);

    affiliateModal.addEventListener("click", e => {
      if (e.target === affiliateModal) closeModal();
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeModal();
    });
  }

});
