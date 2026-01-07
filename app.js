// ===========================
// APP.JS – Refly (Video + Text Cards)
// ===========================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------
   🔒 ACCESS CONTROL
  --------------------------- */
  if (sessionStorage.getItem("hasAccess") !== "true") {
    window.location.href = "gate.html";
    return;
  }

  /* ---------------------------
     DOM REFERENCES
  --------------------------- */
  const grid = document.getElementById("grid");
  const searchInput = document.getElementById("searchInput");
  const openAffiliateModal = document.getElementById("openAffiliateModal");
  const affiliateModal = document.getElementById("affiliateModal");
  const closeModalBtn = document.querySelector(".close-modal");

  let posts = [];

  /* ---------------------------
     FETCH DATA
  --------------------------- */
  fetch("data.json")
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch data.json");
      return res.json();
    })
    .then(data => {
      posts = Array.isArray(data) ? data : [];
      renderPosts(posts);
      initLazyVideos();
    })
    .catch(err => {
      console.error(err);
      if (grid) {
        grid.innerHTML = "<p style='color:#ff4d4d;'>Failed to load content.</p>";
      }
    });

  /* ---------------------------
     RENDER POSTS
  --------------------------- */
  function renderPosts(data) {
    if (!grid) return;
    grid.innerHTML = "";

    data.forEach(post => {
      const postEl = document.createElement("article");
      postEl.className = "post";

      postEl.innerHTML = `
        <h2 class="post-title">${post.title || ""}</h2>
        <p class="post-desc">${post.description || ""}</p>
      `;

      const cardsWrapper = document.createElement("div");
      cardsWrapper.className = "cards-wrapper";

      (post.cards || []).forEach(card => {
        const cardEl = renderCard(card);
        if (cardEl) cardsWrapper.appendChild(cardEl);
      });

      postEl.appendChild(cardsWrapper);
      postEl.appendChild(renderActions(post));
      grid.appendChild(postEl);
    });
  }

  /* ---------------------------
     RENDER SINGLE CARD
  --------------------------- */
  function renderCard(card) {
    if (!card || !card.type) return null;

    const el = document.createElement("div");
    el.className = "wa-card";

    if (card.type === "video") {
      el.innerHTML = `
        <div class="wa-media">
          <video
            class="lazy-video"
            data-src="${card.video}"
            playsinline
            muted
            loop
            preload="none"
          ></video>
        </div>
        ${card.caption ? `<div class="wa-caption">${card.caption}</div>` : ""}
      `;
    }

    if (card.type === "text") {
      el.innerHTML = `
        <div class="wa-text">
          <h3>${card.title || ""}</h3>
          <p>${card.text || ""}</p>
        </div>
      `;
    }

    return el;
  }

  /* ---------------------------
     ACTION BUTTONS
  --------------------------- */
  function renderActions(post) {
    const actions = document.createElement("div");
    actions.className = "post-actions";

    if (post.insight) {
      actions.innerHTML += `
        <button onclick="location.href='insight.html?id=${post.insight}'">
          🤔 Insight
        </button>
      `;
    }

    if (post.reference) {
      actions.innerHTML += `
        <button onclick="location.href='reference.html?id=${post.reference}'">
          Reference
        </button>
      `;
    }

    actions.innerHTML += `
      <button onclick="window.open('https://chat.whatsapp.com/HbO36O92c0j1LDowCpbF3v','_blank')">
        Comment
      </button>
    `;

    return actions;
  }

  /* ---------------------------
     SEARCH
  --------------------------- */
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const q = e.target.value.toLowerCase();
      const filtered = posts.filter(p =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
      renderPosts(filtered);
      initLazyVideos();
    });
  }

  /* ---------------------------
     LAZY VIDEO LOADING
  --------------------------- */
  function initLazyVideos() {
    const videos = document.querySelectorAll(".lazy-video");

    if (!("IntersectionObserver" in window)) {
      videos.forEach(v => loadVideo(v));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadVideo(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    videos.forEach(video => observer.observe(video));
  }

  function loadVideo(video) {
    if (!video.dataset.src) return;
    video.src = video.dataset.src;
    video.load();
  }

  /* ---------------------------
     AFFILIATE MODAL
  --------------------------- */
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
      if (e.key === "Escape" && !affiliateModal.classList.contains("hidden")) {
        closeModal();
      }
    });
  }

});
