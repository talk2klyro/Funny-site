// ===========================
// APP.JS – VIDEO + TEXT + LOCKED CARDS
// ===========================

document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------
  // 🔒 ACCESS CONTROL
  // ---------------------------
  if (sessionStorage.getItem("hasAccess") !== "true") {
    window.location.href = "gate.html";
  }

  // ---------------------------
  // DOM REFERENCES
  // ---------------------------
  const grid = document.getElementById("posts-container") || document.getElementById("grid");
  const searchInput = document.getElementById("searchInput");
  const openAffiliateModal = document.getElementById("openAffiliateModal");
  const affiliateModal = document.getElementById("affiliateModal");
  const closeModalBtn = document.querySelector(".close-modal");

  let items = [];

  // ---------------------------
  // UTILITY: Roman numerals (optional)
  // ---------------------------
  function toRoman(num) {
    const roman = ["","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"];
    return roman[num] || num;
  }

  // ---------------------------
  // RENDER FUNCTION
  // ---------------------------
  function render(data) {
    if (!grid) return;
    grid.innerHTML = "";

    data.forEach(post => {
      const postDiv = document.createElement("div");
      postDiv.className = "post";

      // Post title & description
      const header = document.createElement("h2");
      header.textContent = post.title;
      postDiv.appendChild(header);

      if (post.description) {
        const desc = document.createElement("p");
        desc.textContent = post.description;
        postDiv.appendChild(desc);
      }

      // Cards wrapper
      const cardsWrapper = document.createElement("div");
      cardsWrapper.className = "cards-wrapper";

      (post.cards || []).forEach((card, idx) => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";

        // ---------- VIDEO CARD ----------
        if (card.type === "video" && card.video) {
          const videoWrapper = document.createElement("div");
          videoWrapper.className = "card-video";

          const video = document.createElement("video");
          video.src = card.video;
          video.poster = card.thumbnail || "";
          video.controls = true;
          video.preload = "metadata";
          video.loading = "lazy";
          videoWrapper.appendChild(video);

          // Overlay for locked videos
          if (card.locked) {
            const overlay = document.createElement("div");
            overlay.className = "locked-overlay";
            overlay.textContent = "🔒 Unlock to watch";
            videoWrapper.appendChild(overlay);
          }

          cardDiv.appendChild(videoWrapper);

        // ---------- TEXT CARD ----------
        } else if (card.type === "text") {
          const title = document.createElement("h3");
          title.textContent = card.title || "";
          const text = document.createElement("p");
          text.textContent = card.text || "";
          cardDiv.appendChild(title);
          cardDiv.appendChild(text);
        }

        cardsWrapper.appendChild(cardDiv);
      });

      postDiv.appendChild(cardsWrapper);

      // ---------- POST ACTION BUTTONS ----------
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "post-actions";

      if (post.insight) {
        const insightBtn = document.createElement("button");
        insightBtn.className = "btn-insight";
        insightBtn.textContent = "🤔 Insight";
        insightBtn.addEventListener("click", () => {
          window.location.href = `insight.html?id=${post.insight}`;
        });
        actionsDiv.appendChild(insightBtn);
      }

      if (post.reference) {
        const refBtn = document.createElement("button");
        refBtn.className = "btn-reference";
        refBtn.textContent = "Reference";
        refBtn.addEventListener("click", () => {
          window.location.href = `reference.html?id=${post.reference}`;
        });
        actionsDiv.appendChild(refBtn);
      }

      // Comment button → WhatsApp channel
      const commentBtn = document.createElement("button");
      commentBtn.className = "btn-comment";
      commentBtn.textContent = "Comment";
      commentBtn.addEventListener("click", () => {
        window.open("https://whatsapp.com/channel/0029Vb77PdM6LwHtxQS6u638", "_blank");
      });
      actionsDiv.appendChild(commentBtn);

      postDiv.appendChild(actionsDiv);

      grid.appendChild(postDiv);
    });

    // Ensure videos and images lazy load and fit nicely
    document.querySelectorAll(".card-video video").forEach(v => {
      v.style.width = "100%";
      v.style.height = "100%";
      v.style.objectFit = "cover";
      v.loading = "lazy";
    });
  }

  // ---------------------------
  // FETCH DATA
  // ---------------------------
  async function loadPosts() {
    try {
      const res = await fetch("data.json");
      const data = await res.json();
      items = (data.posts && Array.isArray(data.posts)) ? data.posts : [];
      render(items);
    } catch (err) {
      console.error("Failed to load data.json:", err);
      if (grid) grid.innerHTML = "<p style='color:#ff4d4d;'>Failed to load content.</p>";
    }
  }

  loadPosts();

  // ---------------------------
  // SEARCH FUNCTIONALITY
  // ---------------------------
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const q = e.target.value.toLowerCase();
      const filtered = items.filter(post =>
        post.title.toLowerCase().includes(q) ||
        (post.description && post.description.toLowerCase().includes(q)) ||
        (post.cards && post.cards.some(card =>
          (card.title && card.title.toLowerCase().includes(q)) ||
          (card.text && card.text.toLowerCase().includes(q))
        ))
      );
      render(filtered);
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
      if (e.key === "Escape" && !affiliateModal.classList.contains("hidden")) closeModal();
    });
  }

});
