const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

console.log("GrowItWithHR Compliance Engine Started");

const today = new Date().toISOString().split("T")[0];
const epfoUpdatesUrl = "https://www.epfindia.gov.in/site_en/Updates.php";

function loadJson(path, fallback) {
  if (!fs.existsSync(path)) {
    return fallback;
  }

  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function extractEpfoUpdates(html) {
  const $ = cheerio.load(html);
  const updates = [];

  $("a").each((_, element) => {
    const title = $(element).text().replace(/\s+/g, " ").trim();
    const href = $(element).attr("href");

    if (!title || !href) {
      return;
    }

    const lowerTitle = title.toLowerCase();

    if (!lowerTitle.includes("notification") && !lowerTitle.includes("circular") && !lowerTitle.includes("update")) {
      return;
    }

    const url = new URL(href, epfoUpdatesUrl).toString();

    updates.push({
      date: today,
      source: "EPFO",
      summary: title,
      url
    });
  });

  return updates.slice(0, 20);
}

(async () => {
  const historyPath = "data/update-history.json";
  const liveUpdatesPath = "data/live-updates.json";
  const history = loadJson(historyPath, { knownUpdates: [] });
  const existingData = loadJson(liveUpdatesPath, { recentUpdates: [] });
  const existingUpdates = existingData.recentUpdates || [];

  let scrapedUpdates = [];

  try {
    const response = await axios.get(epfoUpdatesUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36"
      },
      timeout: 30000
    });

    scrapedUpdates = extractEpfoUpdates(response.data);
    console.log(`EPFO page fetched successfully; parsed ${scrapedUpdates.length} candidate updates`);
  } catch (error) {
    console.error("EPFO fetch failed");
    console.error(error.toString());
  }

  const newUpdates = scrapedUpdates.filter(update => {
    const updateKey = `${update.source}|${update.summary}|${update.url}`;

    if (history.knownUpdates.includes(updateKey)) {
      return false;
    }

    history.knownUpdates.push(updateKey);
    return true;
  });

  const liveUpdates = {
    lastVerified: today,
    recentUpdates: newUpdates.length > 0
      ? [...newUpdates, ...existingUpdates].slice(0, 20)
      : existingUpdates
  };

  fs.writeFileSync(liveUpdatesPath, JSON.stringify(liveUpdates, null, 2));
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

  console.log(newUpdates.length > 0 ? "New compliance update detected" : "No new updates detected");
  console.log("Live updates and history saved successfully");
})();
