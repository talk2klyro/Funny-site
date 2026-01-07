// ===========================
// APP.JS – VIDEO + TEXT + MERCH CARDS (Optimized & Fixed)
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
  // UTILITY: Roman numerals
  // ---------------------------
  const toRoman = num => ["","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"][num] || num;

  // ---------------------------
  // CREATE CARD HTML (Video / Text / Merch)
  // ---------------------------
  const createCard = card => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    // Video card
    if (card.video) {
      cardDiv.innerHTML = `
        <div class="card-media">
          <video controls preload="none" poster="${card.poster || ''}">
            <source src="${card.video}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      `;
    }
    // Merch card
    else if (card.merch) {
      cardDiv.innerHTML = `
        <div class="card-merch">
          <h3>${card.title}</h3>
          <p class="price">${card.price || "N/A"}</p>
          <p class="availability">${card.availability || "Available"}</p>
        </div>
      `;
    }
    // Text card
    else {
      cardDiv.innerHTML = `
        <h3>${card.title}</h3>
        <p>${card.text || ""}</p>
      `;
    }

    return cardDiv;
  };

  // ---------------------------
  // RENDER POSTS
  // ---------------------------
  const render = data => {
    if (!grid) return;
    grid.innerHTML = "";

    data.forEach(post => {
      const postDiv = document.createElement("div");
      postDiv.className = "post";

      // Title & description
      postDiv.innerHTML = `
        <h2>${post.title}</h2>
        ${post.description ? `<p>${post.description}</p>` : ""}
      `;

      // Cards wrapper
      const cardsWrapper = document.createElement("div");
      cardsWrapper.className = "cards-wrapper";
      (post.cards || []).forEach(card => cardsWrapper.appendChild(createCard(card)));

      postDiv.appendChild(cardsWrapper);

      // Action buttons
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "post-actions";

      if (post.insight) {
        const btn = document.createElement("button");
        btn.className = "btn-insight";
        btn.textContent = "Insight";
        btn.addEventListener("click", () => window.location.href = `insight.html?id=${post.insight}`);
        actionsDiv.appendChild(btn);
      }

      if (post.reference) {
        const btn = document.createElement("button");
        btn.className = "btn-reference";
        btn.textContent = "Reference";
        btn.addEventListener("click", () => window.location.href = `reference.html?id=${post.reference}`);
        actionsDiv.appendChild(btn);
      }

      // WhatsApp comment button
      const commentBtn = document.createElement("button");
      commentBtn.className = "btn-comment";
      commentBtn.textContent = "Comment";
      commentBtn.addEventListener("click", () => window.open("https://whatsapp.com/channel/0029Vb77PdM6LwHtxQS6u638", "_blank"));
      actionsDiv.appendChild(commentBtn);

      postDiv.appendChild(actionsDiv);
      grid.appendChild(postDiv);
    });
  };

  // ---------------------------
  // FETCH DATA
  // ---------------------------
  const loadPosts = async () => {
    try {
      const res = await fetch("data.json");
      let data = await res.json();
      if (!Array.isArray(data)) data = [data];
      items = data;
      render(items);
    } catch (err) {
      console.error("Failed to load data.json:", err);
      if (grid) grid.innerHTML = "<p style='color:#ff4d4d;'>Failed to load content.</p>";
    }
  };
  loadPosts();

  // ---------------------------
  // SEARCH
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
    affiliateModal.addEventListener("click", e => { if (e.target === affiliateModal) closeModal(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !affiliateModal.classList.contains("hidden")) closeModal(); });
  }

});
