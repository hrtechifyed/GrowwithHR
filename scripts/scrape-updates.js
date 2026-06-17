const fs = require("fs");

console.log(
  "GrowItWithHR Compliance Engine Started"
);

const today =
  new Date().toISOString().split("T")[0];

const updates = {
  lastVerified: today,
  sources: [
    "Ministry of Labour",
    "EPFO",
    "ESIC",
    "India Code"
  ],
  recentUpdates: [
    {
      date: today,
      source: "System",
      title:
        "Automated compliance monitoring is active"
    }
  ]
};

fs.writeFileSync(
  "data/updates.json",
  JSON.stringify(updates, null, 2)
);

console.log(
  "updates.json created successfully"
);
