function loadSavedWorks() {
  const saved = JSON.parse(localStorage.getItem("savedWorks")) || [];
  displaySaved(saved);
}

function displaySaved(works) {
  const savedSection = document.getElementById("savedSection");
  savedSection.innerHTML = "";

  if (works.length === 0) {
    savedSection.innerHTML = "<p>No saved works yet.</p>";
    return;
  }

  works.forEach((work, index) => {
    const card = document.createElement("div");
    card.classList.add("result-card");

    card.innerHTML = `
      <div class="result-card-content">
        <h3>${work.title}${work.subtitle ? ` — <em>${work.subtitle}</em>` : ""}</h3>
        <p><strong>Author:</strong> ${work.author}</p>
        <p><strong>Publisher:</strong> ${work.publisher}</p>
        <p><strong>Year:</strong> ${work.year}</p>
        <p><strong>Category:</strong> ${work.category}</p>
        <p><strong>Abstract:</strong> ${work.abstract}</p>
      </div>
      <div class="card-buttons">
        <button class="btn view-btn" onclick="viewSaved(${index})">View</button>
        <button class="btn remove-btn" onclick="removeSaved(${index})">Remove</button>
      </div>
    `;

    savedSection.appendChild(card);
  });
}

function viewSaved(index) {
  // Redirect to retrieve.html with ?savedId
  window.location.href = `retrieve.html?savedId=${index}`;
}

function removeSaved(index) {
  const saved = JSON.parse(localStorage.getItem("savedWorks")) || [];
  saved.splice(index, 1); // remove 1 item at position index
  localStorage.setItem("savedWorks", JSON.stringify(saved));
  loadSavedWorks(); // refresh display
}

// 🔑 Ensure works are loaded on page load
window.onload = loadSavedWorks;

let allSaved = []; // keep a global copy

function loadSavedWorks() {
  allSaved = JSON.parse(localStorage.getItem("savedWorks")) || [];
  displaySaved(allSaved);

  // === Search functionality ===
  const searchInput = document.getElementById("savedSearchInput");
  const searchBtn = document.getElementById("savedSearchBtn");

  function filterSaved() {
    const query = searchInput.value.toLowerCase();
    const filtered = allSaved.filter(work =>
      work.title.toLowerCase().includes(query) ||
      work.author.toLowerCase().includes(query) ||
      work.category.toLowerCase().includes(query)
    );
    displaySaved(filtered);
  }

  searchBtn.addEventListener("click", filterSaved);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      filterSaved();
    }
  });
}
