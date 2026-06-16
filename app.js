document.addEventListener("DOMContentLoaded", async () => {

  try {

    // =====================================
    // LOAD DATA FILES
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

    if (
      !updatesResponse.ok ||
      !statesResponse.ok ||
      !entitiesResponse.ok ||
      !industriesResponse.ok ||
      !engineResponse.ok
    ) {
      throw new Error(
        "One or more JSON files failed to load."
      );
    }

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

    console.log(
      "GrowItWithHR Engine Loaded Successfully"
    );

    // =====================================
    // UPDATE LAST VERIFIED
    // =====================================

    const lastVerified =
      document.getElementById(
        "lastVerified"
      );

    if (lastVerified) {

      lastVerified.innerText =
        `Last Verified: ${updatesData.lastVerified}`;

    }

    const exampleVerified =
      document.getElementById(
        "exampleVerified"
      );

    if (exampleVerified) {

      exampleVerified.innerText =
        `Last Verified: ${updatesData.lastVerified}`;

    }

    // =====================================
    // RECENT UPDATES
    // =====================================

    const updatesContainer =
      document.getElementById(
        "updatesContainer"
      );

    if (
      updatesContainer &&
      updatesData.recentUpdates
    ) {

      updatesContainer.innerHTML = "";

      updatesData.recentUpdates.forEach(
        update => {

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

          updatesContainer.appendChild(
            card
          );

        }
      );

    }

    // =====================================
    // POPULATE STATES
    // =====================================

    const stateSelect =
      document.getElementById(
        "stateSelect"
      );

    if (stateSelect) {

      const locations = [

        ...(statesData.states || []),

        ...(statesData.unionTerritories || [])

      ];

      locations.forEach(
        location => {

          const option =
            document.createElement(
              "option"
            );

          option.value =
            location;

          option.textContent =
            location;

          stateSelect.appendChild(
            option
          );

        }
      );

    }

    // =====================================
    // POPULATE ENTITY TYPES
    // =====================================

    const entitySelect =
      document.getElementById(
        "entitySelect"
      );

    if (entitySelect) {

      const entities = [

        ...(entityData.businessEntities || []),

        ...(entityData.nonProfitEntities || []),

        ...(entityData.specialCategories || [])

      ];

      entities.forEach(
        entity => {

          const option =
            document.createElement(
              "option"
            );

          option.value =
            entity.name;

          option.textContent =
            entity.name;

          entitySelect.appendChild(
            option
          );

        }
      );

    }

    // =====================================
    // POPULATE INDUSTRIES
    // =====================================

    const industrySelect =
      document.getElementById(
        "industrySelect"
      );

    if (industrySelect) {

      industriesData.industries.forEach(
        industry => {

          const option =
            document.createElement(
              "option"
            );

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
    // REPORT ID GENERATOR
    // =====================================

    function generateReportId() {

      const number =
        Math.floor(
          100000 +
          Math.random() * 900000
        );

      return `#HRTechify_${number}`;

    }

    // =====================================
    // COMPLIANCE SCORE
    // =====================================

    function calculateScore(
      mandatoryCount,
      recommendedCount
    ) {

      let score = 50;

      score +=
        mandatoryCount * 5;

      score +=
        recommendedCount * 2;

      if (score > 100) {
        score = 100;
      }

      return score;

    }

    // =====================================
    // RISK LEVEL
    // =====================================

    function getRiskLevel(
      score
    ) {

      if (score >= 85) {

        return {
          label:"Low Risk",
          className:"risk-low"
        };

      }

      if (score >= 70) {

        return {
          label:"Moderate Risk",
          className:"risk-medium"
        };

      }

      return {
        label:"High Risk",
        className:"risk-high"
      };

    }

    // =====================================
    // EXECUTIVE SUMMARY
    // =====================================

    function generateSummary(
      state,
      entity,
      industry,
      employeeBand,
      mandatoryCount,
      recommendedCount
    ) {

      return `
      Based on the selected profile,
      the organisation operates as a
      ${entity}
      in
      ${state}
      within the
      ${industry}
      sector.

      At the current workforce size of
      ${employeeBand},
      the assessment identified
      ${mandatoryCount}
      immediate compliance priorities
      and
      ${recommendedCount}
      recommended HR governance actions.

      Organisations at this stage
      should focus on strengthening
      compliance foundations,
      workforce governance,
      policy frameworks,
      documentation controls
      and future scalability.
      `;

    }

    // =====================================
    // PART 2 STARTS HERE
    // =====================================
    // =====================================
    // GENERATE REPORT BUTTON
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

          // ==========================
          // VALIDATION
          // ==========================

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
                engineData.stateRules[state]
                  .mandatory || []
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
          ).forEach(
            threshold => {

              if (
                employeeCount >=
                parseInt(threshold)
              ) {

                const rule =
                  engineData
                    .employeeThresholdRules[
                      threshold
                    ];

                mandatory.push(
                  ...(rule.mandatory || [])
                );

                recommended.push(
                  ...(rule.recommended || [])
                );

              }

            }
          );

          // ==========================
          // FUTURE READINESS
          // ==========================

          Object.keys(
            engineData.futureReadiness || {}
          ).forEach(
            threshold => {

              if (
                employeeCount >=
                parseInt(threshold)
              ) {

                future.push(
                  ...engineData.futureReadiness[
                    threshold
                  ]
                );

              }

            }
          );

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
          // FALLBACKS
          // ==========================

          if (
            mandatory.length === 0
          ) {

            mandatory.push(
              "No mandatory compliance obligations currently configured."
            );

          }

          if (
            recommended.length === 0
          ) {

            recommended.push(
              "No HR recommendations currently configured."
            );

          }

          if (
            future.length === 0
          ) {

            future.push(
              "Continue reviewing governance requirements as the organisation grows."
            );

          }

          // ==========================
          // REPORT CALCULATIONS
          // ==========================

          const reportId =
            generateReportId();

          const score =
            calculateScore(
              mandatory.length,
              recommended.length
            );

          const risk =
            getRiskLevel(score);

          const summary =
            generateSummary(
              state,
              entity,
              industry,
              employeeBand,
              mandatory.length,
              recommended.length
            );

          // ==========================
          // SOURCE HTML
          // ==========================

          let sourceHTML = "";

          (engineData.sources || [])
            .forEach(source => {

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

            });

          // ==========================
          // LIST HTML
          // ==========================

          const mandatoryHTML =
            mandatory.map(
              item =>
                `<li>${item}</li>`
            ).join("");

          const recommendedHTML =
            recommended.map(
              item =>
                `<li>${item}</li>`
            ).join("");

          const futureHTML =
            future.map(
              item =>
                `<li>${item}</li>`
            ).join("");

          // =====================================
          // PART 3 STARTS HERE
          // =====================================
          // =====================================
          // RENDER REPORT
          // =====================================

          reportContainer.innerHTML = `

          <div class="report-document">

            <div class="report-watermark">
              © HRTECHIFY
            </div>

            <div class="report-top">

              <div class="report-brand">

                <img
                  src="assets/hrtechify-logo.png"
                  alt="HRTechify"
                  class="report-logo">

                <div>

                  <div class="report-subtitle">
                    HRTECHIFY ADVISORY ENGINE
                  </div>

                  <div class="report-title">
                    GrowItWithHR Advisory Report
                  </div>

                </div>

              </div>

              <div class="report-id-box">

                <div class="report-id">
                  ${reportId}
                </div>

                <div class="report-date">
                  Generated:
                  ${new Date().toLocaleDateString()}
                </div>

              </div>

            </div>

            <div class="score-grid">

             
              <div class="score-card">

                <div class="score-number">
                  ${mandatory.length}
                </div>

                <div class="score-text">
                  Immediate Priorities
                </div>

              </div>

              <div class="score-card">

                <div class="score-number">
                  ${recommended.length}
                </div>

                <div class="score-text">
                  Recommended Actions
                </div>

              </div>

            </div>

            <div class="executive-summary">

              <h3>
                Executive Summary
              </h3>

              <p>
                ${summary}
              </p>

              <span class="report-tag">
                ${risk.label}
              </span>

            </div>

            <div class="report-section">

              <h3>
                Organisation Profile
              </h3>

              <table class="profile-table">

                <tr>
                  <td>State / UT</td>
                  <td>${state}</td>
                </tr>

                <tr>
                  <td>Entity Type</td>
                  <td>${entity}</td>
                </tr>

                <tr>
                  <td>Industry</td>
                  <td>${industry}</td>
                </tr>

                <tr>
                  <td>Employee Count</td>
                  <td>${employeeBand}</td>
                </tr>

              </table>

            </div>

            <div class="report-section">

              <h3>
                Immediate Priorities
              </h3>

              <ul class="report-list">
                ${mandatoryHTML}
              </ul>

            </div>

            <div class="report-section">

              <h3>
                Recommended HR Actions
              </h3>

              <ul class="report-list">
                ${recommendedHTML}
              </ul>

            </div>

            <div class="report-section">

              <h3>
                Growth & Future Readiness
              </h3>

              <ul class="report-list">
                ${futureHTML}
              </ul>

            </div>

            <div class="report-section">

              <h3>
                Official Sources
              </h3>

              <ul class="report-list">
                ${sourceHTML}
              </ul>

            </div>

            <div class="report-divider"></div>

            <div class="report-disclaimer">

              <strong>Last Verified:</strong>
              ${updatesData.lastVerified}

              <br><br>

              <strong>Disclaimer:</strong>

              ${engineData.disclaimer}

            </div>

            <div class="report-footer">

              © 2026 HRTechify |
              GrowItWithHR Advisory Engine

            </div>

            <button
              class="primary-btn print-btn"
              onclick="window.print()">

              Print / Save PDF

            </button>

          </div>

          `;

        });

    }

  } catch (error) {

    console.error(
      "GrowItWithHR Engine Error:",
      error
    );

    const reportContainer =
      document.getElementById(
        "reportContainer"
      );

    if (reportContainer) {

      reportContainer.innerHTML = `
        <div class="alert-item">
          Error loading compliance engine.
          <br>
          ${error.message}
        </div>
      `;

    }

  }

});
