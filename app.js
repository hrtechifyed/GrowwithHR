document.addEventListener("DOMContentLoaded", async () => {

  try {

    const response = await fetch("./data/updates.json");
    const data = await response.json();

    // Update Last Verified in Trust Section
    const trustVerified =
      document.getElementById("lastVerified");

    if (trustVerified) {
      trustVerified.innerText =
        `Last Verified: ${data.lastVerified}`;
    }

    // Update Last Verified in Example Section
    const exampleVerified =
      document.getElementById("exampleVerified");

    if (exampleVerified) {
      exampleVerified.innerText =
        `Last Verified: ${data.lastVerified}`;
    }

    // Render Recent Updates
    const updatesContainer =
      document.getElementById("updatesContainer");

    if (
      updatesContainer &&
      data.recentUpdates &&
      data.recentUpdates.length > 0
    ) {

      updatesContainer.innerHTML = "";

      data.recentUpdates.forEach(update => {

        const updateCard =
          document.createElement("div");

        updateCard.className = "alert-item";

        updateCard.innerHTML = `
          <strong>${update.title}</strong>
          <br>
          Source: ${update.source}
          <br>
          Date: ${update.date}
        `;

        updatesContainer.appendChild(updateCard);

      });

    }

  } catch (error) {

    console.error(
      "Unable to load updates.json",
      error
    );

    const updatesContainer =
      document.getElementById("updatesContainer");

    if (updatesContainer) {
      updatesContainer.innerHTML =
        "<div class='alert-item'>Unable to load compliance updates.</div>";
    }

  }

});
