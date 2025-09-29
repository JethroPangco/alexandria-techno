// Helper: get URL parameter (?id=..., ?uploadedId=..., ?savedId=...)
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function loadWorkDetails() {
  const detailsDiv = document.getElementById("workDetails");

  const idParam = getQueryParam("id");
  const uploadedIdParam = getQueryParam("uploadedId");
  const savedIdParam = getQueryParam("savedId"); // ✅ NEW for Archive

  // Case 1: Uploaded work
  if (uploadedIdParam !== null) {
    const uploaded = JSON.parse(localStorage.getItem("uploadedWorks")) || [];
    const work = uploaded.find(w => w.id === parseInt(uploadedIdParam));

    if (!work) {
      detailsDiv.innerHTML = "<p>Uploaded work not found.</p>";
      return;
    }

    renderWorkDetails(work, true); // editable
    return;
  }

  // Case 2: Saved work (Archive)
  if (savedIdParam !== null) {
    const saved = JSON.parse(localStorage.getItem("savedWorks")) || [];
    const work = saved.find(w => w.id === parseInt(savedIdParam));

    if (!work) {
      detailsDiv.innerHTML = "<p>Saved work not found.</p>";
      return;
    }

    renderWorkDetails(work, work.source === "uploaded"); // editable only if uploaded
    return;
  }

  // Case 3: Preloaded work (works.json)
  if (idParam === null) {
    detailsDiv.innerHTML = "<p>Error: No work selected.</p>";
    return;
  }

  try {
    const response = await fetch("works.json");
    const works = await response.json();

    const work = works.find(w => w.id === parseInt(idParam));

    if (!work) {
      detailsDiv.innerHTML = "<p>Work not found.</p>";
      return;
    }

    renderWorkDetails(work, false);
  } catch (error) {
    console.error("Error loading details:", error);
    detailsDiv.innerHTML = "<p>Failed to load work details.</p>";
  }
}

// === Render details into DOM ===
function renderWorkDetails(work, editable = false) {
  const detailsDiv = document.getElementById("workDetails");

  detailsDiv.innerHTML = `
    <h3>${work.title}${work.subtitle ? ` — <em>${work.subtitle}</em>` : ""}</h3>
    <p><strong>ID:</strong> ${work.id}</p>
    <p><strong>Author:</strong> ${work.author}</p>
    <p><strong>Publisher:</strong> ${work.publisher}</p>
    <p><strong>Year:</strong> ${work.year}</p>
    <p><strong>Category:</strong> ${work.category}</p>
    <p><strong>Abstract:</strong> ${work.abstract}</p>
    ${work.file ? `<a href="files/${work.file}" target="_blank" class="btn view-file">View File</a>` : ""}
    ${editable ? `<button class="btn btn-warning mt-3" onclick="editWork(${work.id})">Edit</button>` : ""}
  `;
}

// ===== Editable Mode for Uploaded Works =====
function editWork(id) {
  let uploaded = JSON.parse(localStorage.getItem("uploadedWorks")) || [];
  const workIndex = uploaded.findIndex(w => w.id === id);

  if (workIndex === -1) {
    alert("This work is not editable.");
    return;
  }

  const work = uploaded[workIndex];
  const detailsDiv = document.getElementById("workDetails");

  detailsDiv.innerHTML = `
    <form id="editForm">
      <div class="mb-3">
        <label class="form-label fw-bold">ID (Read only)</label>
        <input type="text" class="form-control" value="${work.id}" readonly>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Title</label>
        <input type="text" id="editTitle" class="form-control" value="${work.title}">
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Subtitle</label>
        <input type="text" id="editSubtitle" class="form-control" value="${work.subtitle || ""}">
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Author</label>
        <input type="text" id="editAuthor" class="form-control" value="${work.author}">
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Publisher</label>
        <input type="text" id="editPublisher" class="form-control" value="${work.publisher}">
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Year</label>
        <input type="number" id="editYear" class="form-control" value="${work.year}">
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Category</label>
        <input type="text" id="editCategory" class="form-control" value="${work.category}">
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Abstract</label>
        <textarea id="editAbstract" class="form-control" rows="4">${work.abstract}</textarea>
      </div>
      ${work.file ? `<p><strong>Uploaded File:</strong> ${work.file}</p>` : ""}
      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">Save Changes</button>
        <button type="button" id="deleteWork" class="btn btn-danger">Delete Work</button>
      </div>
    </form>
  `;

  // Save changes
  document.getElementById("editForm").addEventListener("submit", (e) => {
    e.preventDefault();

    work.title = document.getElementById("editTitle").value;
    work.subtitle = document.getElementById("editSubtitle").value;
    work.author = document.getElementById("editAuthor").value;
    work.publisher = document.getElementById("editPublisher").value;
    work.year = document.getElementById("editYear").value;
    work.category = document.getElementById("editCategory").value;
    work.abstract = document.getElementById("editAbstract").value;

    uploaded[workIndex] = work;
    localStorage.setItem("uploadedWorks", JSON.stringify(uploaded));

    alert("Changes saved successfully!");
    loadWorkDetails(); // refresh view
  });

  // Delete work
  document.getElementById("deleteWork").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this work?")) {
      uploaded.splice(workIndex, 1);
      localStorage.setItem("uploadedWorks", JSON.stringify(uploaded));
      alert("Work deleted.");
      window.location.href = "upload.html"; // back to uploads
    }
  });
}

// Init
window.addEventListener("DOMContentLoaded", loadWorkDetails);

/* === Expand/Collapse Tool Logic === */
function toggleTool(id, button) {
  const section = document.getElementById(id);
  section.classList.toggle("open");

  const expanded = section.classList.contains("open");
  button.setAttribute("aria-expanded", expanded);
  button.textContent = expanded ? "Collapse" : "Expand";
}
