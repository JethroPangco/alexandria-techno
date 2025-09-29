document.getElementById("uploadForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // 🔑 Get next ID counter from localStorage or start at 35
  let nextId = parseInt(localStorage.getItem("nextUploadId")) || 35;

  const newWork = {
    id: nextId, // assign unique ID
    title: document.getElementById("title").value || "Untitled",
    subtitle: document.getElementById("subtitle").value || null,
    author: document.getElementById("author").value,
    publisher: document.getElementById("publisher").value,
    year: document.getElementById("year").value,
    category: document.getElementById("category").value,
    abstract: document.getElementById("abstract").value,
    file: document.getElementById("file").files[0]?.name || null,
  };

  let storedWorks = JSON.parse(localStorage.getItem("uploadedWorks")) || [];
  storedWorks.push(newWork);
  localStorage.setItem("uploadedWorks", JSON.stringify(storedWorks));

  // 🔑 Increment and save counter for next upload
  localStorage.setItem("nextUploadId", nextId + 1);

  alert("Your work has been uploaded successfully!");

  loadPublishedWorks();
  this.reset();
});

function loadPublishedWorks() {
  const published = JSON.parse(localStorage.getItem("uploadedWorks")) || [];
  displayPublished(published);
}

function displayPublished(works) {
  const publishedSection = document.getElementById("publishedSection");
  publishedSection.innerHTML = "";

  if (works.length === 0) {
    publishedSection.innerHTML = "<p>No works published yet.</p>";
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
        <button class="btn view-btn" onclick="viewUploadedWork(${work.id})">View</button>
        <button class="btn remove-btn" onclick="removePublished(${index})">Unpublish</button>
      </div>
    `;

    publishedSection.appendChild(card);
  });
}

/* 🔑 View handler */
function viewUploadedWork(id) {
  window.location.href = `retrieve.html?uploadedId=${id}`;
}

function removePublished(index) {
  const published = JSON.parse(localStorage.getItem("uploadedWorks")) || [];
  published.splice(index, 1);
  localStorage.setItem("uploadedWorks", JSON.stringify(published));
  loadPublishedWorks();
}

window.onload = loadPublishedWorks;

/* === Expand/Collapse Tool Logic === */
function toggleTool(id, button) {
  const section = document.getElementById(id);
  section.classList.toggle("open");

  const expanded = section.classList.contains("open");
  button.setAttribute("aria-expanded", expanded);
  button.textContent = expanded ? "Collapse" : "Expand";
}
