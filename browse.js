let allWorks = []; // 🔑 define globally

async function loadWorks() {
  let works = [];

  try {
    const response = await fetch("works.json");
    works = await response.json();

    // Tag all preloaded works
    works = works.map(w => ({ ...w, source: "preloaded" }));
  } catch (error) {
    console.error("Error loading works.json:", error);
  }

  // Load uploads from localStorage + tag them
  const uploaded =
    (JSON.parse(localStorage.getItem("uploadedWorks")) || []).map(w => ({
      ...w,
      source: "uploaded",
    }));

  // Merge both
  allWorks = [...works, ...uploaded]; // 🔑 assign to global

  displayResults(allWorks);

  // === Search functionality ===
  const searchInput = document.getElementById("savedSearchInput");
  const searchBtn = document.getElementById("savedSearchBtn");

  function filterSaved() {
    const query = searchInput.value.toLowerCase();
    const filtered = allWorks.filter(
      work =>
        work.title.toLowerCase().includes(query) ||
        work.author.toLowerCase().includes(query) ||
        work.category.toLowerCase().includes(query)
    );
    displayResults(filtered);
  }

  searchBtn.addEventListener("click", filterSaved);
  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      filterSaved();
    }
  });
}

function displayResults(works) {
  const resultsSection = document.getElementById("resultsSection");
  resultsSection.innerHTML = "";

  if (works.length === 0) {
    resultsSection.innerHTML = "<p>No results found.</p>";
    return;
  }

  works.forEach(work => {
    const card = document.createElement("div");
    card.classList.add("result-card");

    // Use source to decide link type
    const viewLink =
      work.source === "uploaded"
        ? `retrieve.html?uploadedId=${work.id}`
        : `retrieve.html?id=${work.id}`;

    card.innerHTML = `
      <div class="result-card-content">
        <h3>${work.title}${
      work.subtitle ? ` — <em>${work.subtitle}</em>` : ""
    }</h3>
        <p><strong>Author:</strong> ${work.author}</p>
        <p><strong>Publisher:</strong> ${work.publisher}</p>
        <p><strong>Year:</strong> ${work.year}</p>
        <p><strong>Category:</strong> ${work.category}</p>
        <p><strong>Abstract:</strong> ${work.abstract}</p>
      </div>
      <div class="card-buttons">
        <a class="btn view-btn" href="${viewLink}">View</a>
        <button class="btn save-btn" onclick="saveWork(${work.id}, '${work.source}')">Save</button>
      </div>
    `;

    resultsSection.appendChild(card);
  });
}

window.onload = loadWorks;

function saveWork(id, source) {
  const saved = JSON.parse(localStorage.getItem("savedWorks")) || [];
  const work = allWorks.find(w => w.id === id && w.source === source); // 🔑 also check source
  if (work) {
    saved.push(work);
    localStorage.setItem("savedWorks", JSON.stringify(saved));
    alert("Work saved!");
  }
}
