// ===========================
// APP.JS – VIDEO + TEXT + MERCH CARDS
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

      // Loop through cards
      (post.cards || []).forEach(card => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";

        // Determine if card is video, merch, or text
        if (card.video) {
          const videoWrapper = document.createElement("div");
          videoWrapper.className = "card-video";
          const video = document.createElement("video");
          video.src = card.video;
          video.setAttribute("controls", "true");
          video.setAttribute("preload", "metadata");
          video.setAttribute("loading", "lazy");
          videoWrapper.appendChild(video);
          cardDiv.appendChild(videoWrapper);
        } else if (card.merch) {
          const merchDiv = document.createElement("div");
          merchDiv.className = "card-merch";
          merchDiv.innerHTML = `
            <h3>${card.title}</h3>
            <p class="price">${card.price || "N/A"}</p>
            <p class="availability">${card.availability || "Available"}</p>
          `;
          cardDiv.appendChild(merchDiv);
        } else {
          const title = document.createElement("h3");
          title.textContent = card.title;
          const text = document.createElement("p");
          text.textContent = card.text;
          cardDiv.appendChild(title);
          cardDiv.appendChild(text);
        }

        cardsWrapper.appendChild(cardDiv);
      });

      postDiv.appendChild(cardsWrapper);

      // Action buttons
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "post-actions";

      if (post.insight) {
        const insightBtn = document.createElement("button");
        insightBtn.className = "btn-insight";
        insightBtn.textContent = "Insight";
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

      // ---------------------------
      // COMMENT BUTTON (WhatsApp channel)
      // ---------------------------
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
  }

  // ---------------------------
  // FETCH DATA
  // ---------------------------
  async function loadPosts() {
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
  }

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
    affiliateModal.addEventListener("click", e => {
      if (e.target === affiliateModal) closeModal();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !affiliateModal.classList.contains("hidden")) closeModal();
    });
  }

});
