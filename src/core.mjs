export const stages = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

export function normaliseApplication(input) {
  const company = String(input.company ?? "").trim();
  const role = String(input.role ?? "").trim();
  if (!company || !role) throw new Error("Company and role are required.");

  return {
    id: input.id ?? crypto.randomUUID(),
    company,
    role,
    location: String(input.location ?? "Remote").trim() || "Remote",
    stage: stages.includes(input.stage) ? input.stage : "Saved",
    appliedOn: input.appliedOn || new Date().toISOString().slice(0, 10),
    url: String(input.url ?? "").trim(),
    notes: String(input.notes ?? "").trim(),
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

export function filterApplications(items, { query = "", stage = "All" } = {}) {
  const needle = query.trim().toLowerCase();
  return items.filter((item) => {
    const haystack = [item.company, item.role, item.location, item.notes].join(" ").toLowerCase();
    return (!needle || haystack.includes(needle)) && (stage === "All" || item.stage === stage);
  });
}

export function getMetrics(items) {
  const count = (stage) => items.filter((item) => item.stage === stage).length;
  const active = items.filter((item) => ["Applied", "Interview", "Offer"].includes(item.stage)).length;
  return { total: items.length, active, interviews: count("Interview"), offers: count("Offer") };
}

