const fs = require("fs");

console.log("GrowItWithHR Compliance Engine Started");

const today = new Date().toISOString().split("T")[0];

// Load history
const historyPath = "data/update-history.json";

let history = {
  knownUpdates: []
};

if (fs.existsSync(historyPath)) {
  history = JSON.parse(
    fs.readFileSync(historyPath, "utf8")
  );
}

// Simulated update for testing
const latestUpdate = {
  date: today,
  source: "EPFO",
  title: "EPFO compliance monitoring test",
  url: "https://www.epfindia.gov.in"
};

const updateKey =
  `${latestUpdate.source}|${latestUpdate.title}`;

const alreadyExists =
  history.knownUpdates.includes(updateKey);

let newUpdates = [];

if (!alreadyExists) {
  history.knownUpdates.push(updateKey);
  newUpdates.push(latestUpdate);

  console.log(
    "New compliance update detected"
  );
} else {
  console.log(
    "No new updates detected"
  );
}

const liveUpdates = {
  lastVerified: today,
  recentUpdates: newUpdates
};

fs.writeFileSync(
  "data/live-updates.json",
  JSON.stringify(liveUpdates, null, 2)
);

fs.writeFileSync(
  historyPath,
  JSON.stringify(history, null, 2)
);

console.log(
  "Updates and history saved successfully"
);
