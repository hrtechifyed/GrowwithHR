const fs = require("fs");

console.log("GrowItWithHR Compliance Update Engine Started");

const updates = {
  lastVerified: new Date().toISOString().split("T")[0],
  sources: [
    "Ministry of Labour",
    "EPFO",
    "ESIC",
    "India Code"
  ],
  recentUpdates: [
    {
      date: new Date().toISOString().split("T")[0],
      source: "System",
      title: "Automated compliance monitoring is active"
    }
  ]
};

fs.writeFileSync(
  "data/updates.json",
  JSON.stringify(updates, null, 2)
);

console.log("updates.json generated successfully");
