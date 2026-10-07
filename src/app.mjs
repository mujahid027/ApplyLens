import { filterApplications, getMetrics, normaliseApplication, stages } from "./core.mjs";

const STORE = "applylens.applications.v1";
const seed = [
  { id: "a1", company: "Northstar Labs", role: "Product Designer", location: "Bengaluru · Hybrid", stage: "Interview", appliedOn: "2026-09-28", notes: "Portfolio review on Friday", url: "", createdAt: "2026-09-28T08:00:00.000Z" },
  { id: "a2", company: "Cedar & Co.", role: "Frontend Engineer", location: "Remote", stage: "Applied", appliedOn: "2026-10-02", notes: "Referred by a former colleague", url: "", createdAt: "2026-10-02T08:00:00.000Z" },
  { id: "a3", company: "Orbit Finance", role: "UX Research Intern", location: "Mumbai · On-site", stage: "Saved", appliedOn: "2026-10-04", notes: "Tailor research case study", url: "", createdAt: "2026-10-04T08:00:00.000Z" }
];

let applications = read();
let activeStage = "All";
let query = "";

const list = document.querySelector("#applications");
const empty = document.querySelector("#empty-state");
const form = document.querySelector("#application-form");
const dialog = document.querySelector("#application-dialog");

function read() {
  try { return JSON.parse(localStorage.getItem(STORE)) || seed; } catch { return seed; }
}
function persist() { localStorage.setItem(STORE, JSON.stringify(applications)); }
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}
function render() {
  const visible = filterApplications(applications, { query, stage: activeStage });
  const metrics = getMetrics(applications);
  Object.entries(metrics).forEach(([key, value]) => { document.querySelector(`[data-metric="${key}"]`).textContent = value; });
  list.innerHTML = visible.map((item) => `
    <article class="application-card">
      <div class="card-heading"><div><h3>${escapeHtml(item.company)}</h3><p>${escapeHtml(item.role)}</p></div><span class="stage stage-${item.stage.toLowerCase()}">${item.stage}</span></div>
      <div class="metadata"><span>⌖ ${escapeHtml(item.location)}</span><span>◷ ${new Date(item.appliedOn + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span></div>
      ${item.notes ? `<p class="note">${escapeHtml(item.notes)}</p>` : ""}
      <div class="card-actions"><button class="text-button" data-edit="${item.id}">Edit</button><button class="text-button danger" data-delete="${item.id}">Delete</button></div>
    </article>`).join("");
  empty.hidden = visible.length !== 0;
  list.hidden = visible.length === 0;
}
function openDialog(item) {
  form.reset();
  document.querySelector("#dialog-title").textContent = item ? "Update application" : "Add an application";
  form.elements.id.value = item?.id || "";
  for (const key of ["company", "role", "location", "stage", "appliedOn", "url", "notes"]) form.elements[key].value = item?.[key] || (key === "stage" ? "Saved" : key === "appliedOn" ? new Date().toISOString().slice(0, 10) : "");
  dialog.showModal();
}

document.querySelector("#new-application").addEventListener("click", () => openDialog());
document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
document.querySelector("#search").addEventListener("input", (event) => { query = event.target.value; render(); });
document.querySelector("#stage-filter").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-stage]"); if (!button) return;
  activeStage = button.dataset.stage; document.querySelectorAll("[data-stage]").forEach((node) => node.classList.toggle("selected", node === button)); render();
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  try {
    const app = normaliseApplication(values);
    applications = values.id ? applications.map((item) => item.id === values.id ? { ...app, createdAt: item.createdAt } : item) : [app, ...applications];
    persist(); dialog.close(); render();
  } catch (error) { document.querySelector("#form-error").textContent = error.message; }
});
list.addEventListener("click", (event) => {
  const id = event.target.dataset.edit || event.target.dataset.delete; if (!id) return;
  if (event.target.dataset.delete) { applications = applications.filter((item) => item.id !== id); persist(); render(); }
  else openDialog(applications.find((item) => item.id === id));
});
document.querySelector("#reset-demo").addEventListener("click", () => { applications = seed; persist(); activeStage = "All"; query = ""; document.querySelector("#search").value = ""; document.querySelectorAll("[data-stage]").forEach((node) => node.classList.toggle("selected", node.dataset.stage === "All")); render(); });

render();

