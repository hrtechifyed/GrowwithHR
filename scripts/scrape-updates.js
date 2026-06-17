const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

console.log(
  "GrowItWithHR Compliance Engine Started"
);

const today =
  new Date().toISOString().split("T")[0];

/* ==========================================
   LOAD HISTORY
========================================== */

const historyPath =
  "data/update-history.json";

let history = {
  knownUpdates: []
};

if (
  fs.existsSync(historyPath)
) {

  history = JSON.parse(
    fs.readFileSync(
      historyPath,
      "utf8"
    )
  );

}

/* ==========================================
   TEST UPDATE
========================================== */

const latestUpdate = {

  date: today,

  source: "EPFO",

  summary:
    "Check out the latest EPFO notification regarding employer compliance requirements.",

  url:
    "https://www.epfindia.gov.in/site_en/"

};

const updateKey =
  `${latestUpdate.source}|${latestUpdate.summary}`;

const alreadyExists =
  history.knownUpdates.includes(
    updateKey
  );

let newUpdates = [];

if (!alreadyExists) {

  history.knownUpdates.push(
    updateKey
  );

  newUpdates.push(
    latestUpdate
  );

  console.log(
    "New compliance update detected"
  );

} else {

  console.log(
    "No new updates detected"
  );

}

/* ==========================================
   SAVE LIVE UPDATES
========================================== */

const liveUpdatesPath =
  "data/live-updates.json";

let existingUpdates = [];

if (
  fs.existsSync(
    liveUpdatesPath
  )
) {

  const existingData =
    JSON.parse(
      fs.readFileSync(
        liveUpdatesPath,
        "utf8"
      )
    );

  existingUpdates =
    existingData.recentUpdates || [];

}

const liveUpdates = {

  lastVerified: today,

  recentUpdates:

    newUpdates.length > 0

      ? [
          ...newUpdates,
          ...existingUpdates
        ].slice(0, 20)

      : existingUpdates

};

fs.writeFileSync(

  liveUpdatesPath,

  JSON.stringify(
    liveUpdates,
    null,
    2
  )

);

/* ==========================================
   SAVE HISTORY
========================================== */

fs.writeFileSync(

  historyPath,

  JSON.stringify(
    history,
    null,
    2
  )

);

console.log(
  "Live updates and history saved successfully"
);
