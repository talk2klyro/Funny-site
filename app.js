document.addEventListener("DOMContentLoaded", () => {

  if (sessionStorage.getItem("hasAccess") !== "true") {
    window.location.href = "gate.html";
    return;
  }

  const grid = document.getElementById("posts-container");
  const searchInput = document.getElementById("searchInput");
  const videoModal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  const closeModal = videoModal.querySelector(".close");

  let posts = [];

  async function loadPosts() {
    try {
      const res = await fetch("data.json");
      posts = await res.json();
      displayPosts(posts);
    } catch (err) {
      console.error("Failed to load posts", err);
    }
  }

  function displayPosts(postsArray) {
    grid.innerHTML = ""; // Clear old cards
    postsArray.forEach(post => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${post.thumbnail}" alt="${post.title}" class="card-thumb" />
        <h3 class="card-title">${post.title}</h3>
        <button class="play-btn">Play</button>
      `;

      // Play video on button click
      card.querySelector(".play-btn").addEventListener("click", () => {
        modalVideo.src = post.url;
        videoModal.style.display = "block";
        modalVideo.play();
      });

      grid.appendChild(card);
    });
  }

  // Search filter
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = posts.filter(p => p.title.toLowerCase().includes(query));
    displayPosts(filtered);
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    videoModal.style.display = "none";
    modalVideo.pause();
    modalVideo.src = "";
  });

  loadPosts();
});
