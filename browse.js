let allWorks = []; // 🔑 define globally

async function loadWorks() {
  let works = [];

  try {
    const response = await fetch("works.json");
    works = await response.json();
  } catch (error) {
    console.error("Error loading works.json:", error);
  }

  // Load uploads from localStorage
  const uploaded = JSON.parse(localStorage.getItem("uploadedWorks")) || [];

  // Merge both
  allWorks = [...works, ...uploaded]; // 🔑 assign to global

  displayResults(allWorks);

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

    const viewLink =  work.file
    ? `retrieve.html?uploadedId=${work.id}`  // uploaded work
    : `retrieve.html?id=${work.id}`;    

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
        <a class="btn view-btn" href="${viewLink}">View</a>
        <button class="btn save-btn" onclick="saveWork(${work.id})">Save</button>
      </div>
    `;

    resultsSection.appendChild(card);
  });
}

function viewWork(index) {
  window.location.href = `retrieve.html?id=${index}`;
}

window.onload = loadWorks;

function saveWork(id) {
  const saved = JSON.parse(localStorage.getItem("savedWorks")) || [];
  const work = allWorks.find(w => w.id === id); // 🔑 find by ID
  if (work) {
    saved.push(work);
    localStorage.setItem("savedWorks", JSON.stringify(saved));
    alert("Work saved!");
  }
}
