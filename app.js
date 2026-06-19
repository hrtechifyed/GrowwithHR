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

  /* ==========================================
     POPULATE STATES
  ========================================== */
  /* ==========================================
     Debug 2
  ========================================== */

console.log("stateSelect", stateSelect);

console.log("entitySelect", entitySelect);

console.log("industrySelect", industrySelect);
  /* ==========================================
     Debug 2
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
   CURRENT BAND + NEXT BAND
========================================== */

const thresholds = Object.keys(
  engineData.employeeThresholdRules || {}
)
.map(Number)
.sort((a,b)=>a-b);

let currentThreshold = null;
let nextThreshold = null;

for (let i = 0; i < thresholds.length; i++) {

  if (
    employeeCount >= thresholds[i]
  ) {

    currentThreshold =
      thresholds[i];

    nextThreshold =
      thresholds[i + 1] || null;

  }

}

/* CURRENT BAND */

if (
  currentThreshold &&
  engineData
    .employeeThresholdRules[
      currentThreshold
    ]
) {

  const rule =
    engineData
      .employeeThresholdRules[
        currentThreshold
      ];

  mandatory.push(
    ...(rule.mandatory || [])
  );

  recommended.push(
    ...(rule.recommended || [])
  );

}

/* NEXT BAND PREVIEW */

if (
  nextThreshold &&
  engineData
    .employeeThresholdRules[
      nextThreshold
    ]
) {

  const nextRule =
    engineData
      .employeeThresholdRules[
        nextThreshold
      ];

  future.push(

    `As your workforce approaches ${nextThreshold}+ employees, prepare for:`,

    ...(nextRule.mandatory || []),

    ...(nextRule.recommended || [])

  );

}
        /* ==========================================
   FUTURE READINESS
   NEXT MATURITY LEVEL ONLY
========================================== */

const futureThresholds = Object.keys(
  engineData.futureReadiness || {}
)
.map(Number)
.sort((a,b)=>a-b);

let nextFutureBand = null;

for (let i = 0; i < futureThresholds.length; i++) {

  if (
    employeeCount <
    futureThresholds[i]
  ) {

    nextFutureBand =
      futureThresholds[i];

    break;

  }

}

if (
  nextFutureBand &&
  engineData.futureReadiness[
    nextFutureBand
  ]
) {

  future.push(

    ...engineData.futureReadiness[
      nextFutureBand
    ]

  );

}
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

<div class="executive-summary">

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
          Executive HR Advisory Summary
        </div>

      </div>

    </div>

  </div>

  <div class="profile-grid">

    <div class="profile-card">

      <span>State / UT</span>

      <strong>
        ${reportData.state}
      </strong>

    </div>

    <div class="profile-card">

      <span>Entity Type</span>

      <strong>
        ${reportData.entity}
      </strong>

    </div>

    <div class="profile-card">

      <span>Industry</span>

      <strong>
        ${reportData.industry}
      </strong>

    </div>

    <div class="profile-card">

      <span>Employee Count</span>

      <strong>
        ${reportData.employeeBand}
      </strong>

    </div>

  </div>

  <div class="summary-cards">

    <div class="summary-card">

      <h3>
        Compliance Obligations
      </h3>

      <p>

        State-specific labour law obligations,
        statutory requirements and workforce
        compliance considerations relevant to
        your organisation.

      </p>

      <a
      href="compliance-roadmap.html"
      class="primary-btn">

        View Compliance Roadmap →

      </a>

    </div>

    <div class="summary-card">

      <h3>
        People & HR Foundations
      </h3>

      <p>

        Policies, documentation, employee
        lifecycle practices and governance
        frameworks required to build a scalable
        organisation.

      </p>

      <a
      href="people-roadmap.html"
      class="primary-btn">

        View People Roadmap →

      </a>

    </div>

    <div class="summary-card">

      <h3>
        Growth Readiness
      </h3>

      <p>

        Capabilities required to support
        workforce growth, leadership
        development, governance maturity
        and organisational scale.

      </p>

      <a
      href="growth-roadmap.html"
      class="primary-btn">

        View Growth Roadmap →

      </a>

    </div>

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
