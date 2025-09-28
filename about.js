function toggleTool(id, button) {
  const section = document.getElementById(id);
  section.classList.toggle("open");

  const expanded = section.classList.contains("open");
  button.setAttribute("aria-expanded", expanded);
  button.textContent = expanded ? "Collapse" : "Expand";
}
