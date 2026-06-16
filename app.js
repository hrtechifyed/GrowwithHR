document.addEventListener(
"DOMContentLoaded",
async () => {
console.log("VERSION TEST 999");

try {

  /* ==========================================
     LOAD JSON FILES
  ========================================== */

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
      "One or more data files failed to load."
    );

  }

console.log("updates");
const updatesData =
  await updatesResponse.json();
console.log("updates OK");

console.log("states");
const statesData =
  await statesResponse.json();
console.log("states OK");

console.log("entities");
const entityData =
  await entitiesResponse.json();
console.log("entities OK");

console.log("industries");
const industriesData =
  await industriesResponse.json();
console.log("industries OK");

console.log("engine");
const engineData =
  await engineResponse.json();
console.log("engine OK");
  
  /* ==========================================
     DOM REFERENCES
  ========================================== */

  const stateSelect =
    document.getElementById(
      "stateSelect"
    );

  const entitySelect =
    document.getElementById(
      "entitySelect"
    );

  const industrySelect =
    document.getElementById(
      "industrySelect"
    );

  const employeeCountSelect =
    document.getElementById(
      "employeeCount"
    );

  const generateButton =
    document.getElementById(
      "generateReport"
    );

  const reportContainer =
    document.getElementById(
      "reportContainer"
    );

  const updatesContainer =
    document.getElementById(
      "updatesContainer"
    );

  /* ==========================================
     POPULATE STATES
  ========================================== */

  if (stateSelect) {

    const locations = [

      ...statesData.states,

      ...statesData.unionTerritories

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

  /* ==========================================
     POPULATE ENTITY TYPES
  ========================================== */

  if (entitySelect) {

    const entities = [

      ...entityData.businessEntities,

      ...entityData.nonProfitEntities,

      ...entityData.specialCategories

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

  /* ==========================================
     POPULATE INDUSTRIES
  ========================================== */

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

  /* ==========================================
     LOAD COMPLIANCE UPDATES
  ========================================== */

  if (
    updatesContainer &&
    updatesData.recentUpdates
  ) {

    updatesContainer.innerHTML = "";

    updatesData.recentUpdates.forEach(
      update => {

        const card =
          document.createElement(
            "div"
          );

        card.className =
          "update-card";

        card.innerHTML = `

          <div class="update-date">

            ${update.date}

          </div>

          <h3>

<a
href="${update.url}"
target="_blank"
rel="noopener noreferrer"
class="update-link">

${update.title}

</a>

</h3>

          <p>

            Source:
            ${update.source}

          </p>

        `;

        updatesContainer.appendChild(
          card
        );

      }
    );

  }

  /* ==========================================
     EMPLOYEE BAND HELPER
  ========================================== */

  function getEmployeeCountValue(
    band
  ) {

    const bands = {

      "1-5":5,
      "6-9":9,
      "10-19":19,
      "20-49":49,
      "50-99":99,
      "100-249":249,
      "250-499":499,
      "500-999":999,
      "1000-4999":4999,
      "5000-9999":9999,
      "10000-24999":24999,
      "25000-49999":49999,
      "50000-99999":99999,
      "100000+":100000

    };

    return (
      bands[band] || 0
    );

  }
  /* ==========================================
     GENERATE REPORT
  ========================================== */

  if (generateButton) {

    generateButton.addEventListener(
      "click",
      () => {

        const state =
          stateSelect.value;

        const entity =
          entitySelect.value;

        const industry =
          industrySelect.value;

        const employeeBand =
          employeeCountSelect.value;

        if (
          !state ||
          !entity ||
          !industry
        ) {

          reportContainer.innerHTML = `

          <div class="report-error">

            Please complete all selections
            before generating a report.

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

        /* ==========================================
           STATE RULES
        ========================================== */

        if (
          engineData.stateRules &&
          engineData.stateRules[state]
        ) {

          mandatory.push(

            ...(
              engineData
                .stateRules[state]
                .mandatory || []
            )

          );

        }

        /* ==========================================
           ENTITY RULES
        ========================================== */

        if (
          engineData.entityRules &&
          engineData.entityRules[
            entity
          ]
        ) {

          const entityRule =

            engineData
              .entityRules[
                entity
              ];

          mandatory.push(

            ...(
              entityRule.mandatory || []
            )

          );

          recommended.push(

            ...(
              entityRule.recommended || []
            )

          );

        }

        /* ==========================================
           INDUSTRY RULES
        ========================================== */

        if (
          engineData.industryRules &&
          engineData.industryRules[
            industry
          ]
        ) {

          recommended.push(

            ...(
              engineData
                .industryRules[
                  industry
                ]
                .recommended || []
            )

          );

        }

        /* ==========================================
           EMPLOYEE THRESHOLDS
        ========================================== */

        Object.keys(

          engineData
            .employeeThresholdRules || {}

        ).forEach(
          threshold => {

            if (

              employeeCount >=
              parseInt(
                threshold
              )

            ) {

              const rule =

                engineData
                  .employeeThresholdRules[
                    threshold
                  ];

              mandatory.push(

                ...(
                  rule.mandatory || []
                )

              );

              recommended.push(

                ...(
                  rule.recommended || []
                )

              );

            }

          }
        );

        /* ==========================================
           FUTURE READINESS
        ========================================== */

        Object.keys(

          engineData
            .futureReadiness || {}

        ).forEach(
          threshold => {

            if (

              employeeCount >=
              parseInt(
                threshold
              )

            ) {

              future.push(

                ...engineData
                  .futureReadiness[
                    threshold
                  ]

              );

            }

          }
        );

        /* ==========================================
           REMOVE DUPLICATES
        ========================================== */

        mandatory =
          [
            ...new Set(
              mandatory
            )
          ];

        recommended =
          [
            ...new Set(
              recommended
            )
          ];

        future =
          [
            ...new Set(
              future
            )
          ];

        /* ==========================================
           FALLBACKS
        ========================================== */

        if (
          mandatory.length === 0
        ) {

          mandatory.push(

            "No immediate mandatory requirements currently configured."

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

            "Continue monitoring workforce growth and compliance obligations."

          );

        }

        /* ==========================================
           REPORT DATA OBJECT
        ========================================== */

        const reportData = {

          generatedDate:

            new Date()
              .toLocaleDateString(),

          state,

          entity,

          industry,

          employeeBand,

          mandatory,

          recommended,

          future,

          sources:

            engineData.sources || [],

          disclaimer:

            engineData.disclaimer || ""

        };
        /* ==========================================
           BUILD SOURCES
        ========================================== */

        let sourcesHTML = "";

        reportData.sources.forEach(
          source => {

            sourcesHTML += `

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

        /* ==========================================
           BUILD REPORT
        ========================================== */

        reportContainer.innerHTML = `

        <div class="report-document">

          <div class="report-header">

            <div class="report-brand">

              <img
              src="assets/hrtechify-logo.png"
              alt="HRTechify Logo"
              class="report-logo">

              <div>

                <div class="report-title">

                  GrowItWithHR

                </div>

                <div class="report-subtitle">

                  Executive HR Advisory Report

                </div>

              </div>

            </div>

            <div class="report-meta">

              Generated:
              ${reportData.generatedDate}

            </div>

          </div>

          <div class="report-banner">

            HR Compliance & Workforce Governance Advisory

          </div>

          <div class="profile-grid">

            <div class="profile-card">

              <span>
              State / UT
              </span>

              <strong>
              ${reportData.state}
              </strong>

            </div>

            <div class="profile-card">

              <span>
              Entity Type
              </span>

              <strong>
              ${reportData.entity}
              </strong>

            </div>

            <div class="profile-card">

              <span>
              Industry
              </span>

              <strong>
              ${reportData.industry}
              </strong>

            </div>

            <div class="profile-card">

              <span>
              Employee Count
              </span>

              <strong>
              ${reportData.employeeBand}
              </strong>

            </div>

          </div>

          <div class="report-section">

            <h3>

              Immediate Priorities

            </h3>

            <ul class="report-list">

              ${reportData.mandatory
                .map(
                  item => `
                  <li>
                  ✓ ${item}
                  </li>
                  `
                )
                .join("")}

            </ul>

          </div>

          <div class="report-section">

            <h3>

              Recommended Actions

            </h3>

            <ul class="report-list">

              ${reportData.recommended
                .map(
                  item => `
                  <li>
                  ✓ ${item}
                  </li>
                  `
                )
                .join("")}

            </ul>

          </div>

          <div class="report-section">

            <h3>

              Future Readiness

            </h3>

            <ul class="report-list">

              ${reportData.future
                .map(
                  item => `
                  <li>
                  ✓ ${item}
                  </li>
                  `
                )
                .join("")}

            </ul>

          </div>

          <div class="report-section">

            <h3>

              Official Sources

            </h3>

            <ul class="sources-list">

              ${sourcesHTML}

            </ul>

          </div>

          <div class="report-disclaimer">

            <strong>
            Disclaimer:
            </strong>

            ${reportData.disclaimer}

          </div>

          <div class="report-footer">

            Last Updated:
            ${engineData.lastUpdated || "N/A"}

            <br><br>

            HRTechify | GrowItWithHR

          </div>

          <div class="report-actions">

            <button
            class="primary-btn print-btn"
            onclick="window.print()">

              Print / Save PDF

            </button>

          </div>

        </div>

        `;

        reportContainer.scrollIntoView({

          behavior:"smooth",

          block:"start"

        });

      }
    );

  }

} catch(error) {

  console.error(
    "GrowItWithHR V6 Error:",
    error
  );

  const reportContainer =
    document.getElementById(
      "reportContainer"
    );

  if(reportContainer){

    reportContainer.innerHTML = `

    <div class="report-error">

      Unable to load advisory engine.

      Please verify all data files
      are available and correctly deployed.

    </div>

    `;

  }

}

}
);
