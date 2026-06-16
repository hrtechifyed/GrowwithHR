document.addEventListener("DOMContentLoaded", async () => {

  try {

    console.clear();

    console.log("====================================");
    console.log("GROWITWITHHR DEBUG MODE");
    console.log("====================================");

    // =====================================
    // FETCH FILES
    // =====================================

    const updatesResponse =
      await fetch("./data/updates.json");

    const statesResponse =
      await fetch("./data/states.json");

    const entitiesResponse =
      await fetch("./data/entity-types.json");

    const industriesResponse =
      await fetch("./data/industries.json");

    const engineResponse =
      await fetch("./data/compliance-engine.json");

    // =====================================
    // RESPONSE STATUS
    // =====================================

    console.log(
      "updates.json:",
      updatesResponse.status,
      updatesResponse.ok
    );

    console.log(
      "states.json:",
      statesResponse.status,
      statesResponse.ok
    );

    console.log(
      "entity-types.json:",
      entitiesResponse.status,
      entitiesResponse.ok
    );

    console.log(
      "industries.json:",
      industriesResponse.status,
      industriesResponse.ok
    );

    console.log(
      "compliance-engine.json:",
      engineResponse.status,
      engineResponse.ok
    );

    // =====================================
    // RAW FILE CONTENTS
    // =====================================

    const updatesText =
      await updatesResponse.text();

    const statesText =
      await statesResponse.text();

    const entitiesText =
      await entitiesResponse.text();

    const industriesText =
      await industriesResponse.text();

    const engineText =
      await engineResponse.text();

    console.log("====================================");
    console.log("RAW FILE CHECK");
    console.log("====================================");

    console.log(
      "updates.json first 200 chars:",
      updatesText.substring(0,200)
    );

    console.log(
      "states.json first 200 chars:",
      statesText.substring(0,200)
    );

    console.log(
      "entity-types.json first 200 chars:",
      entitiesText.substring(0,200)
    );

    console.log(
      "industries.json first 200 chars:",
      industriesText.substring(0,200)
    );

    console.log(
      "compliance-engine.json first 200 chars:",
      engineText.substring(0,200)
    );

    // =====================================
    // PARSE JSON INDIVIDUALLY
    // =====================================

    let updatesData;
    let statesData;
    let entityData;
    let industriesData;
    let engineData;

    try {

      updatesData =
        JSON.parse(updatesText);

      console.log(
        "✓ updates.json parsed"
      );

    } catch(error) {

      console.error(
        "❌ updates.json INVALID JSON"
      );

      console.error(error);

    }

    try {

      statesData =
        JSON.parse(statesText);

      console.log(
        "✓ states.json parsed"
      );

    } catch(error) {

      console.error(
        "❌ states.json INVALID JSON"
      );

      console.error(error);

    }

    try {

      entityData =
        JSON.parse(entitiesText);

      console.log(
        "✓ entity-types.json parsed"
      );

    } catch(error) {

      console.error(
        "❌ entity-types.json INVALID JSON"
      );

      console.error(error);

    }

    try {

      industriesData =
        JSON.parse(industriesText);

      console.log(
        "✓ industries.json parsed"
      );

    } catch(error) {

      console.error(
        "❌ industries.json INVALID JSON"
      );

      console.error(error);

    }

    try {

      engineData =
        JSON.parse(engineText);

      console.log(
        "✓ compliance-engine.json parsed"
      );

    } catch(error) {

      console.error(
        "❌ compliance-engine.json INVALID JSON"
      );

      console.error(error);

    }

    // =====================================
    // DOM CHECK
    // =====================================

    console.log("====================================");
    console.log("DOM CHECK");
    console.log("====================================");

    const stateSelect =
      document.getElementById("stateSelect");

    const entitySelect =
      document.getElementById("entitySelect");

    const industrySelect =
      document.getElementById("industrySelect");

    console.log(
      "stateSelect:",
      stateSelect
    );

    console.log(
      "entitySelect:",
      entitySelect
    );

    console.log(
      "industrySelect:",
      industrySelect
    );

    // =====================================
    // POPULATE STATES
    // =====================================

    if (
      stateSelect &&
      statesData
    ) {

      const locations = [

        ...(statesData.states || []),

        ...(statesData.unionTerritories || [])

      ];

      console.log(
        "Locations found:",
        locations.length
      );

      locations.forEach(location => {

        const option =
          document.createElement("option");

        option.value =
          location;

        option.textContent =
          location;

        stateSelect.appendChild(
          option
        );

      });

      console.log(
        "✓ States dropdown populated"
      );

    }

    // =====================================
    // POPULATE ENTITYS
    // =====================================

    if (
      entitySelect &&
      entityData
    ) {

      const entities = [

        ...(entityData.businessEntities || []),

        ...(entityData.nonProfitEntities || []),

        ...(entityData.specialCategories || [])

      ];

      console.log(
        "Entities found:",
        entities.length
      );

      entities.forEach(entity => {

        const option =
          document.createElement("option");

        option.value =
          entity.name;

        option.textContent =
          entity.name;

        entitySelect.appendChild(
          option
        );

      });

      console.log(
        "✓ Entity dropdown populated"
      );

    }

    // =====================================
    // POPULATE INDUSTRIES
    // =====================================

    if (
      industrySelect &&
      industriesData
    ) {

      console.log(
        "Industries found:",
        industriesData.industries?.length
      );

      industriesData.industries.forEach(
        industry => {

          const option =
            document.createElement("option");

          option.value =
            industry.name;

          option.textContent =
            industry.name;

          industrySelect.appendChild(
            option
          );

        }
      );

      console.log(
        "✓ Industry dropdown populated"
      );

    }

    console.log("====================================");
    console.log("DEBUG COMPLETE");
    console.log("====================================");

  } catch(error) {

    console.error(
      "FATAL ERROR"
    );

    console.error(error);

    console.error(
      error.message
    );

    console.error(
      error.stack
    );

  }

});
