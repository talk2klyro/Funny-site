// ===========================
// APP.JS – VIDEO + TEXT + MERCH CARDS (FIXED)
// ===========================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------
     🔒 ACCESS CONTROL
  ---------------------------- */
  if (sessionStorage.getItem("hasAccess") !== "true") {
    window.location.href = "gate.html";
    return;
  }

  /* ---------------------------
     DOM REFERENCES
  ---------------------------- */
  const grid =
    document.getElementById("posts-container") ||
    document.getElementById("grid");

  const searchInput = document.getElementById("searchInput");
  const openAffiliateModal = document.getElementById("openAffiliateModal");
  const affiliateModal = document.getElementById("affiliateModal");
  const closeModalBtn = document.querySelector(".close-modal");

  let items = [];

  /* ---------------------------
     HELPERS
  ---------------------------- */

  const isDirectVideo = url =>
    /\.(mp4|webm|ogg)$/i.test(url || "");

  const isYouTube = url =>
    /youtube\.com|youtu\.be/.test(url || "");

  const isInstagram = url =>
    /instagram\.com/.test(url || "");

  const isTikTok = url =>
    /tiktok\.com/.test(url || "");

  const isFacebook = url =>
    /facebook\.com/.test(url || "");

  function getEmbedUrl(url) {
    if (isYouTube(url)) {
      const id =
        url.split("v=")[1]?.split("&")[0] ||
        url.split("/").pop();
      return `https://www.youtube.com/embed/${id}`;
    }

    if (isInstagram(url)) {
      return `${url}embed`;
    }

    if (isTikTok(url)) {
      return `https://www.tiktok.com/embed/${url.split("/").pop()}`;
    }

    if (isFacebook(url)) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
    }

    return null;
  }

  function createLockedCard(card) {
    const locked = document.createElement("div");
    locked.className = "card-locked";
    locked.innerHTML = `
      <div class="locked-overlay">
        🔒 Locked Content
        <p>Unlock to watch this video</p>
      </div>
    `;
    if (card.thumbnail) {
      locked.style.backgroundImage = `url(${card.thumbnail})`;
    }
    return locked;
  }

  function createVideoCard(card) {
    if (card.locked) {
      return createLockedCard(card);
    }

    // Direct video files
    if (isDirectVideo(card.video)) {
      const video = document.createElement("video");
      video.src = card.video;
      video.controls = true;
      video.preload = "metadata";
      if (card.thumbnail) video.poster = card.thumbnail;
      return video;
    }

    // Embedded platforms
    const embedUrl = getEmbedUrl(card.video);
    if (embedUrl) {
      const iframe = document.createElement("iframe");
      iframe.src = embedUrl;
      iframe.loading = "lazy";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      return iframe;
    }

    // Fallback
    const fallback = document.createElement("p");
    fallback.textContent = "Video unavailable.";
    return fallback;
  }

  /* ---------------------------
     RENDER
  ---------------------------- */
  function render(data) {
    if (!grid) return;

    grid.innerHTML = "";
    const fragment = document.createDocumentFragment();

    data.forEach(post => {
      const postDiv = document.createElement("div");
      postDiv.className = "post";

      const header = document.createElement("h2");
      header.textContent = post.title;
      postDiv.appendChild(header);

      if (post.description) {
        const desc = document.createElement("p");
        desc.textContent = post.description;
        postDiv.appendChild(desc);
      }

      const cardsWrapper = document.createElement("div");
      cardsWrapper.className = "cards-wrapper";

      (post.cards || []).forEach(card => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";

        if (card.type === "video") {
          cardDiv.appendChild(createVideoCard(card));
        } else if (card.type === "text") {
          const title = document.createElement("h3");
          title.textContent = card.title || "";
          const text = document.createElement("p");
          text.textContent = card.text || "";
          cardDiv.append(title, text);
        } else if (card.merch) {
          cardDiv.innerHTML = `
            <h3>${card.title || ""}</h3>
            <p class="price">${card.price || "N/A"}</p>
            <p class="availability">${card.availability || "Available"}</p>
          `;
        }

        cardsWrapper.appendChild(cardDiv);
      });

      postDiv.appendChild(cardsWrapper);

      /* ---------------------------
         ACTIONS
      ---------------------------- */
      const actions = document.createElement("div");
      actions.className = "post-actions";

      if (post.insight) {
        const btn = document.createElement("button");
        btn.textContent = "Insight";
        btn.onclick = () =>
          (window.location.href = `insight.html?id=${post.insight}`);
        actions.appendChild(btn);
      }

      if (post.reference) {
        const btn = document.createElement("button");
        btn.textContent = "Reference";
        btn.onclick = () =>
          (window.location.href = `reference.html?id=${post.reference}`);
        actions.appendChild(btn);
      }

      const commentBtn = document.createElement("button");
      commentBtn.textContent = "Comment";
      commentBtn.onclick = () =>
        window.open(
          "https://whatsapp.com/channel/0029Vb77PdM6LwHtxQS6u638",
          "_blank"
        );

      actions.appendChild(commentBtn);
      postDiv.appendChild(actions);

      fragment.appendChild(postDiv);
    });

    grid.appendChild(fragment);
  }

  /* ---------------------------
     LOAD DATA
  ---------------------------- */
  async function loadPosts() {
    try {
      const res = await fetch("data.json");
      const json = await res.json();
      items = json.posts || [];
      render(items);
    } catch (err) {
      console.error("Failed to load data.json:", err);
      grid.innerHTML =
        "<p style='color:#ff4d4d;'>Failed to load content.</p>";
    }
  }

  loadPosts();

  /* ---------------------------
     SEARCH
  ---------------------------- */
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const q = e.target.value.toLowerCase();
      render(
        items.filter(post =>
          JSON.stringify(post).toLowerCase().includes(q)
        )
      );
    });
  }

  /* ---------------------------
     AFFILIATE MODAL
  ---------------------------- */
  if (openAffiliateModal && affiliateModal && closeModalBtn) {
    const close = () => {
      affiliateModal.classList.add("hidden");
      document.body.style.overflow = "";
    };

    openAffiliateModal.onclick = () => {
      affiliateModal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    };

    closeModalBtn.onclick = close;
    affiliateModal.onclick = e => e.target === affiliateModal && close();
    document.addEventListener("keydown", e => e.key === "Escape" && close());
  }
});
