document.addEventListener(
"DOMContentLoaded",
async () => {
console.log(
  "GrowItWithHR V6 Engine Initializing..."
);

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

  const updatesData =
    await updatesResponse.json();
    const liveUpdatesResponse =
    await fetch(
      "./data/live-updates.json"
    );

const liveUpdatesData =
  await liveUpdatesResponse.json();

  const statesData =
    await statesResponse.json();

  const entityData =
    await entitiesResponse.json();

  const industriesData =
    await industriesResponse.json();

  const engineData =
    await engineResponse.json();

/* ==========================================
     Debug
  ========================================== */

  console.log("states loaded", statesData);

console.log("entities loaded", entityData);

console.log("industries loaded", industriesData);

console.log("engine loaded", engineData);
/* ==========================================
     Debug
  ========================================== */
  console.log(
    "GrowItWithHR V6 Engine Loaded Successfully"
  );

  

  /* ==========================================
     DOM REFERENCES
  ========================================== */

  const stateSelect =
    document.getElementById(
      "stateSelect"
    );
  const stateList =
    document.getElementById(
    "stateList"
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
  const liveUpdatesContainer =
  document.getElementById(
    "liveUpdatesContainer"
  );


  const locations = [
    ...statesData.states,
    ...statesData.unionTerritories
  ];

  const normalizeLocation = value => {
    const trimmed = (value || "").trim();
    if (trimmed.toLowerCase() === "delhi") {
      return "Delhi (NCT)";
    }
    return locations.find(
      location => location.toLowerCase() === trimmed.toLowerCase()
    ) || "";
  };

  /* ==========================================
     POPULATE STATES
  ========================================== */
  /* ==========================================
     Debug 2
  ========================================== */


  /* ==========================================
     Debug 2
  ========================================== */

  
  if (stateSelect) {

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

        stateList.appendChild(
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

 if (
  liveUpdatesContainer &&
  liveUpdatesData.recentUpdates
) {

  liveUpdatesContainer.innerHTML = "";

  liveUpdatesData.recentUpdates.forEach(
    update => {

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "update-card";

     card.innerHTML = `

  <h3>

<a
href="${update.url}"
target="_blank"
rel="noopener noreferrer"
class="update-link">

${update.summary}

</a>

</h3>

  <p>

    Source:
    ${update.source}

  </p>

`;
      liveUpdatesContainer.appendChild(
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
          normalizeLocation(stateSelect.value);

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

            Please complete all selections with a valid listed state or union territory before generating a report.

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

          const stateRule =

            engineData
              .stateRules[state];

          mandatory.push(

            ...(
              stateRule.mandatory || []
            )

          );

          recommended.push(

            ...(
              stateRule.recommended || []
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

          mandatory.push(

            ...(
              engineData
                .industryRules[
                  industry
                ]
                .mandatory || []
            )

          );

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

        recommended = recommended.filter(
          item => !mandatory.includes(item)
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
           CAPTURE REAL COUNTS BEFORE FALLBACKS
        ========================================== */

        const mandatoryCount = mandatory.length;

        const recommendedCount = recommended.length;

        const futureCount = future.length;

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

          mandatoryCount,

          recommendedCount,

          futureCount,

          sources:

            engineData.sources || [],

          disclaimer:

            engineData.disclaimer || ""

        };
        localStorage.setItem(
          "growitwithhrAssessment",
          JSON.stringify(reportData)
        );
        
        /* ==========================================
           BUILD REPORT
        ========================================== */

        const dashboardWindow = window.open(
          "advisory-dashboard.html",
          "_blank"
        );

        reportContainer.innerHTML = `
          <div class="report-success">
            Your advisory report is ready and has been opened in a new tab.
            ${dashboardWindow ? "" : "Please allow pop-ups for this site, then open the generated report again."}
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
