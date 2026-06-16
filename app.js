document.addEventListener("DOMContentLoaded", async () => {

  try {

    // =====================================
    // LOAD UPDATES
    // =====================================

    const updatesResponse =
      await fetch("./data/updates.json");

    const updatesData =
      await updatesResponse.json();

    // =====================================
    // LOAD COMPLIANCE ENGINE
    // =====================================

    const engineResponse =
      await fetch("./data/compliance-engine.json");

    const engineData =
      await engineResponse.json();

    // =====================================
    // LAST VERIFIED
    // =====================================

    const trustVerified =
      document.getElementById("lastVerified");

    if (trustVerified) {
      trustVerified.innerText =
        `Last Verified: ${updatesData.lastVerified}`;
    }

    const exampleVerified =
      document.getElementById("exampleVerified");

    if (exampleVerified) {
      exampleVerified.innerText =
        `Last Verified: ${updatesData.lastVerified}`;
    }

    // =====================================
    // RECENT UPDATES
    // =====================================

    const updatesContainer =
      document.getElementById("updatesContainer");

    if (
      updatesContainer &&
      updatesData.recentUpdates
    ) {

      updatesContainer.innerHTML = "";

      updatesData.recentUpdates.forEach(update => {

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

    // =====================================
    // LOAD STATES
    // =====================================

    const statesResponse =
      await fetch("./data/states.json");

    const statesData =
      await statesResponse.json();

    const stateSelect =
      document.getElementById("stateSelect");

    if (stateSelect) {

      const locations = [
        ...statesData.states,
        ...statesData.unionTerritories
      ];

      locations.forEach(location => {

        const option =
          document.createElement("option");

        option.value = location;
        option.textContent = location;

        stateSelect.appendChild(option);

      });

    }

    // =====================================
    // LOAD ENTITY TYPES
    // =====================================

    const entityResponse =
      await fetch("./data/entity-types.json");

    const entityData =
      await entityResponse.json();

    const entitySelect =
      document.getElementById("entitySelect");

    if (entitySelect) {

      const entities = [
        ...entityData.businessEntities,
        ...entityData.nonProfitEntities,
        ...entityData.specialCategories
      ];

      entities.forEach(entity => {

        const option =
          document.createElement("option");

        option.value = entity.name;
        option.textContent = entity.name;

        entitySelect.appendChild(option);

      });

    }

    // =====================================
    // LOAD INDUSTRIES
    // =====================================

    const industryResponse =
      await fetch("./data/industries.json");

    const industryData =
      await industryResponse.json();

    const industrySelect =
      document.getElementById("industrySelect");

    if (industrySelect) {

      industryData.industries.forEach(industry => {

        const option =
          document.createElement("option");

        option.value = industry.name;
        option.textContent = industry.name;

        industrySelect.appendChild(option);

      });

    }

    // =====================================
    // EMPLOYEE BAND HELPER
    // =====================================

    function getEmployeeNumber(employeeBand) {

      const mapping = {
        "1-5": 5,
        "6-9": 9,
        "10-19": 19,
        "20-49": 49,
        "50-99": 99,
        "100-249": 249,
        "250-499": 499,
        "500-999": 999,
        "1000-4999": 4999,
        "5000-9999": 9999,
        "10000-24999": 24999,
        "25000-49999": 49999,
        "50000-99999": 99999,
        "100000+": 100000
      };

      return mapping[employeeBand] || 0;

    }

    // =====================================
    // GENERATE REPORT
    // =====================================

    const generateButton =
      document.getElementById("generateReport");

    if (generateButton) {

      generateButton.addEventListener(
        "click",
        () => {

          const state =
            document.getElementById("stateSelect").value;

          const entity =
            document.getElementById("entitySelect").value;

          const industry =
            document.getElementById("industrySelect").value;

          const employeeCount =
            document.getElementById("employeeCount").value;

          const reportContainer =
            document.getElementById("reportContainer");

          if (
            !state ||
            !entity ||
            !industry
          ) {

            reportContainer.innerHTML = `
              <div class="alert-item">
                Please select State, Entity Type and Industry.
              </div>
            `;

            return;

          }

          const employeeNumber =
            getEmployeeNumber(employeeCount);

          let mandatory = [];
          let recommended = [];
          let futureReadiness = [];

          // ==========================
          // STATE RULES
          // ==========================

          if (
            engineData.stateRules &&
            engineData.stateRules[state]
          ) {

            mandatory.push(
              ...engineData.stateRules[state].mandatory
            );

          }

          // ==========================
          // ENTITY RULES
          // ==========================

          if (
            engineData.entityRules &&
            engineData.entityRules[entity]
          ) {

            const entityRule =
              engineData.entityRules[entity];

            if (entityRule.mandatory) {
              mandatory.push(
                ...entityRule.mandatory
              );
            }

            if (entityRule.recommended) {
              recommended.push(
                ...entityRule.recommended
              );
            }

          }

          // ==========================
          // INDUSTRY RULES
          // ==========================

          if (
            engineData.industryRules &&
            engineData.industryRules[industry]
          ) {

            recommended.push(
              ...engineData.industryRules[industry]
                .recommended
            );

          }

          // ==========================
          // EMPLOYEE THRESHOLD RULES
          // ==========================

          Object.keys(
            engineData.employeeThresholdRules
          ).forEach(threshold => {

            if (
              employeeNumber >=
              parseInt(threshold)
            ) {

              const thresholdRule =
                engineData
                .employeeThresholdRules[
                  threshold
                ];

              if (
                thresholdRule.mandatory
              ) {

                mandatory.push(
                  ...thresholdRule.mandatory
                );

              }

              if (
                thresholdRule.recommended
              ) {

                recommended.push(
                  ...thresholdRule.recommended
                );

              }

            }

          });

          // ==========================
          // FUTURE READINESS
          // ==========================

          Object.keys(
            engineData.futureReadiness
          ).forEach(threshold => {

            if (
              employeeNumber >=
              parseInt(threshold)
            ) {

              futureReadiness.push(
                ...engineData.futureReadiness[
                  threshold
                ]
              );

            }

          });

          // ==========================
          // REMOVE DUPLICATES
          // ==========================

          mandatory =
            [...new Set(mandatory)];

          recommended =
            [...new Set(recommended)];

          futureReadiness =
            [...new Set(futureReadiness)];

          // ==========================
          // BUILD SOURCES
          // ==========================

          let sourceHTML = "";

          engineData.sources.forEach(source => {

            sourceHTML += `
            <li>
              <a
                href="${source.url}"
                target="_blank">
                ${source.name}
              </a>
            </li>
            `;

          });

          // ==========================
          // BUILD LISTS
          // ==========================

          const mandatoryHTML =
            mandatory
              .map(item =>
                `<li>✓ ${item}</li>`
              )
              .join("");

          const recommendedHTML =
            recommended
              .map(item =>
                `<li>✓ ${item}</li>`
              )
              .join("");

          const futureHTML =
            futureReadiness
              .map(item =>
                `<li>✓ ${item}</li>`
              )
              .join("");

          // ==========================
          // REPORT
          // ==========================

          reportContainer.innerHTML = `

          <div class="example-card">

            <div class="report-header">

              <img
              src="assets/hrtechify-logo.png"
              alt="HRTechify Logo"
              class="report-logo">

              <div>

                <h2>
                GrowItWithHR Compliance Advisory Report
                </h2>

                <p>
                Generated On:
                ${new Date().toLocaleDateString()}
                </p>

              </div>

            </div>

            <hr>

            <h3>
            Company Profile
            </h3>

            <p>
            <strong>State:</strong>
            ${state}
            </p>

            <p>
            <strong>Entity Type:</strong>
            ${entity}
            </p>

            <p>
            <strong>Industry:</strong>
            ${industry}
            </p>

            <p>
            <strong>Employee Count:</strong>
            ${employeeCount}
            </p>

            <div class="report-highlight">

              <h3>
              Immediate Priorities (0–30 Days)
              </h3>

              <ul>
              ${mandatoryHTML}
              </ul>

            </div>

            <h3>
            Near-Term Priorities (30–90 Days)
            </h3>

            <ul>
            ${recommendedHTML}
            </ul>

            <h3>
            Growth & Future Readiness
            </h3>

            <ul>
            ${futureHTML}
            </ul>

            <h3>
            Official Sources
            </h3>

            <ul>
            ${sourceHTML}
            </ul>

            <p>
            <strong>Last Verified:</strong>
            ${updatesData.lastVerified}
            </p>

            <p>
            <strong>Disclaimer:</strong>
            ${engineData.disclaimer}
            </p>

            <button
            class="primary-btn print-btn"
            onclick="window.print()">
            Print / Save PDF
            </button>

          </div>

          `;

        }

      );

    }

  } catch (error) {

    console.error(
      "GrowItWithHR Engine Error",
      error
    );

  }

});

