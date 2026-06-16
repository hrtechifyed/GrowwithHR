document.addEventListener("DOMContentLoaded", async () => {

  try {

    // =====================================
    // LOAD ALL DATA FILES
    // =====================================

    const [
      updatesResponse,
      statesResponse,
      entitiesResponse,
      industriesResponse,
      engineResponse
    ] = await Promise.all([
      fetch("./data/updates.json"),
      fetch("./data/states.json"),
      fetch("./data/entity-types.json"),
      fetch("./data/industries.json"),
      fetch("./data/compliance-engine.json")
    ]);

    const updatesData =
      await updatesResponse.json();

    const statesData =
      await statesResponse.json();

    const entityData =
      await entitiesResponse.json();

    const industriesData =
      await industriesResponse.json();

    const engineData =
      await engineResponse.json();

    // =====================================
    // LAST VERIFIED
    // =====================================

    const lastVerified =
      document.getElementById("lastVerified");

    if (lastVerified) {
      lastVerified.innerText =
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

        const card =
          document.createElement("div");

        card.className =
          "alert-item";

        card.innerHTML = `
          <strong>${update.title}</strong>
          <br>
          Source: ${update.source}
          <br>
          Date: ${update.date}
        `;

        updatesContainer.appendChild(card);

      });

    }

    // =====================================
    // POPULATE STATES
    // =====================================

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
    // POPULATE ENTITY TYPES
    // =====================================

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
    // POPULATE INDUSTRIES
    // =====================================

    const industrySelect =
      document.getElementById("industrySelect");

    if (industrySelect) {

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

    }

    // =====================================
    // EMPLOYEE BAND HELPER
    // =====================================

    function getEmployeeCountValue(
      band
    ) {

      const bands = {

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

      return bands[band] || 0;

    }

    // =====================================
    // GENERATE REPORT
    // =====================================

    const generateButton =
      document.getElementById(
        "generateReport"
      );

    if (generateButton) {

      generateButton.addEventListener(
        "click",
        () => {

          const state =
            document.getElementById(
              "stateSelect"
            ).value;

          const entity =
            document.getElementById(
              "entitySelect"
            ).value;

          const industry =
            document.getElementById(
              "industrySelect"
            ).value;

          const employeeBand =
            document.getElementById(
              "employeeCount"
            ).value;

          const reportContainer =
            document.getElementById(
              "reportContainer"
            );

          if (
            !state ||
            !entity ||
            !industry
          ) {

            reportContainer.innerHTML = `
              <div class="alert-item">
                Please complete all selections before generating a report.
              </div>
            `;

            return;

          }

          const employeeCount =
            getEmployeeCountValue(
              employeeBand
            );

          let mandatory = [];
          let recommended = [];
          let future = [];

          // ==========================
          // STATE RULES
          // ==========================

          if (
            engineData.stateRules &&
            engineData.stateRules[state]
          ) {

            mandatory.push(
              ...(
                engineData.stateRules[
                  state
                ].mandatory || []
              )
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
              engineData.entityRules[
                entity
              ];

            mandatory.push(
              ...(entityRule.mandatory || [])
            );

            recommended.push(
              ...(entityRule.recommended || [])
            );

          }

          // ==========================
          // INDUSTRY RULES
          // ==========================

          if (
            engineData.industryRules &&
            engineData.industryRules[
              industry
            ]
          ) {

            recommended.push(
              ...(
                engineData.industryRules[
                  industry
                ].recommended || []
              )
            );

          }

          // ==========================
          // EMPLOYEE THRESHOLDS
          // ==========================

          Object.keys(
            engineData.employeeThresholdRules || {}
          ).forEach(threshold => {

            if (
              employeeCount >=
              parseInt(threshold)
            ) {

              const rule =
                engineData.employeeThresholdRules[
                  threshold
                ];

              mandatory.push(
                ...(rule.mandatory || [])
              );

              recommended.push(
                ...(rule.recommended || [])
              );

            }

          });

          // ==========================
          // FUTURE READINESS
          // ==========================

          if (
            engineData.futureReadiness
          ) {

            Object.keys(
              engineData.futureReadiness
            ).forEach(threshold => {

              if (
                employeeCount >=
                parseInt(threshold)
              ) {

                future.push(
                  ...engineData
                    .futureReadiness[
                      threshold
                    ]
                );

              }

            });

          }

          // ==========================
          // REMOVE DUPLICATES
          // ==========================

          mandatory =
            [...new Set(mandatory)];

          recommended =
            [...new Set(recommended)];

          future =
            [...new Set(future)];

          // ==========================
          // EMPTY FALLBACKS
          // ==========================

          if (
            mandatory.length === 0
          ) {

            mandatory.push(
              "No mandatory rules currently configured."
            );

          }

          if (
            recommended.length === 0
          ) {

            recommended.push(
              "No recommendations currently configured."
            );

          }

          if (
            future.length === 0
          ) {

            future.push(
              "Continue monitoring compliance requirements as the organisation grows."
            );

          }

          // ==========================
          // SOURCES
          // ==========================

          let sourceHTML = "";

          if (
            engineData.sources
          ) {

            engineData.sources.forEach(
              source => {

                sourceHTML += `
                <li>
                  <a
                    href="${source.url}"
                    target="_blank"
                    rel="noopener noreferrer">
                    ${source.name}
                  </a>
                </li>
                `;

              }
            );

          }

          // ==========================
          // REPORT OUTPUT
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
                GrowItWithHR Advisory Report
                </h2>

                <p>
                Generated:
                ${new Date().toLocaleDateString()}
                </p>

              </div>

            </div>

            <hr>

            <h3>Organisation Profile</h3>

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
            ${employeeBand}
            </p>

            <div class="report-highlight">

              <h3>
              Immediate Priorities
              </h3>

              <ul>
              ${mandatory.map(item =>
                `<li>✓ ${item}</li>`
              ).join("")}
              </ul>

            </div>

            <h3>
            Near-Term HR Priorities
            </h3>

            <ul>
            ${recommended.map(item =>
              `<li>✓ ${item}</li>`
            ).join("")}
            </ul>

            <h3>
            Growth & Future Readiness
            </h3>

            <ul>
            ${future.map(item =>
              `<li>✓ ${item}</li>`
            ).join("")}
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
      "GrowItWithHR Engine Error:",
      error
    );

  }

});
