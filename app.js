document.addEventListener("DOMContentLoaded", async () => {
  try {

    const response = await fetch("./data/updates.json");

    const data = await response.json();

    const verifiedElement =
      document.getElementById("lastVerified");

    if (verifiedElement) {
      verifiedElement.innerText =
        `Last Verified: ${data.lastVerified}`;
    }

  } catch (error) {
    console.error("Unable to load updates.json", error);
  }
});
