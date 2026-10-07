import test from "node:test";
import assert from "node:assert/strict";
import { filterApplications, getMetrics, normaliseApplication } from "../src/core.mjs";

const data = [
  { company: "Acme", role: "Engineer", location: "Remote", notes: "Referral", stage: "Applied" },
  { company: "Beta", role: "Designer", location: "Mumbai", notes: "", stage: "Interview" }
];

test("normaliseApplication validates required fields", () => {
  assert.throws(() => normaliseApplication({ company: "", role: "Engineer" }), /required/);
  assert.equal(normaliseApplication({ company: " Acme ", role: " Engineer " }).company, "Acme");
});
test("filterApplications finds roles by query and stage", () => {
  assert.equal(filterApplications(data, { query: "referral" }).length, 1);
  assert.equal(filterApplications(data, { stage: "Interview" })[0].company, "Beta");
});
test("getMetrics counts active applications", () => {
  assert.deepEqual(getMetrics(data), { total: 2, active: 2, interviews: 1, offers: 0 });
});

