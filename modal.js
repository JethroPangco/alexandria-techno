// Open modal
function openModal(id) {
  document.getElementById(id).style.display = "flex"; // <-- use flex
}

// Close modal
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// Close modal if clicking outside content
window.onclick = function(event) {
  let modals = document.querySelectorAll(".modal");
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

function redirectToDashboard() {
    // For now no authentication check, just redirect
    window.location.href = "dashboard.html";
  }