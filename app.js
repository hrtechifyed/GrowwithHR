document.addEventListener(
"DOMContentLoaded",
async () => {

console.log(
    "GrowItWithHR V7 Engine Initializing..."
);

let platform = null;

try {

    platform = bootstrap();

    console.log(
        "GrowWithHR Platform Initialized",
        platform
    );

} catch (error) {

    console.error(
        "Platform Bootstrap Failed",
        error
    );

}

try {

  /* ==========================================
     LOAD JSON FILES
  ========================================== */

const [
  updatesResponse,
  statesResponse,
  entitiesResponse,
  industriesResponse,
  engineResponse,
  sourceRegistryResponse,
  centralLawsResponse,
  entitiesRulesResponse,
  industriesRulesResponse,

  epfoResponse,
  esicResponse,
  gratuityResponse,
  bonusResponse,
  maternityResponse,
  poshResponse,
  contractLabourResponse,
  employeesCompensationResponse,
  apprenticesResponse,
  childLabourResponse,
  codeOnWagesResponse,
  oshwcResponse

] = await Promise.all([

  fetch("./data/updates.json"),

  fetch("./data/states.json"),

  fetch("./data/entity-types.json"),

  fetch("./data/industries.json"),

  fetch("./data/compliance-engine.json"),

  fetch("./data/knowledge-base/source-registry.json"),

  fetch("./data/knowledge-base/laws/central/central-laws.json"),

  fetch("./data/knowledge-base/entities/entities.json"),

  fetch("./data/knowledge-base/industries/industries.json"),

  fetch("./data/knowledge-base/laws/central/epfo.json"),

fetch("./data/knowledge-base/laws/central/esic.json"),

fetch("./data/knowledge-base/laws/central/gratuity.json"),

fetch("./data/knowledge-base/laws/central/bonus.json"),

fetch("./data/knowledge-base/laws/central/maternity-benefit.json"),

fetch("./data/knowledge-base/laws/central/posh.json"),

fetch("./data/knowledge-base/laws/central/contract-labour.json"),

fetch("./data/knowledge-base/laws/central/employees-compensation.json"),

fetch("./data/knowledge-base/laws/central/apprentices.json"),

fetch("./data/knowledge-base/laws/central/child-labour.json"),

fetch("./data/knowledge-base/laws/central/code-on-wages.json"),

fetch("./data/knowledge-base/laws/central/oshwc-code.json")

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

 console.log(
  "Source Registry",
  sourceRegistryResponse.status,
  sourceRegistryResponse.url
);

if (!sourceRegistryResponse.ok)
  throw new Error("source-registry.json not found");

if (!centralLawsResponse.ok)
  throw new Error("central-laws.json not found");

if (!entitiesRulesResponse.ok)
  throw new Error("entities.json not found");

if (!industriesRulesResponse.ok)
  throw new Error("industries.json not found");

const sourceRegistry =
  await sourceRegistryResponse.json();

const centralLaws =
  await centralLawsResponse.json();

const entityRules =
  await entitiesRulesResponse.json();

const industryRules =
  await industriesRulesResponse.json();

  /* ==========================================
   CENTRAL LAW KNOWLEDGE BASE
========================================== */

const centralKnowledgeBase = {

  epfo: await epfoResponse.json(),

  esic: await esicResponse.json(),

  gratuity: await gratuityResponse.json(),

  bonus: await bonusResponse.json(),

  maternityBenefit: await maternityResponse.json(),

  posh: await poshResponse.json(),

  contractLabour: await contractLabourResponse.json(),

  employeesCompensation:
    await employeesCompensationResponse.json(),

  apprentices:
    await apprenticesResponse.json(),

  childLabour:
    await childLabourResponse.json(),

  codeOnWages:
    await codeOnWagesResponse.json(),

  oshwc:
    await oshwcResponse.json()

};

 /* ==========================================
   LOAD STATE KNOWLEDGE BASE
========================================== */

const stateFiles = {

  "Andaman and Nicobar Islands":"andaman-and-nicobar.json",
  "Andhra Pradesh":"andhra-pradesh.json",
  "Arunachal Pradesh":"arunachal-pradesh.json",
  "Assam":"assam.json",
  "Bihar":"bihar.json",
  "Chandigarh":"chandigarh.json",
  "Chhattisgarh":"chhattisgarh.json",
  "Dadra and Nagar Haveli and Daman and Diu":"dadra-and-nagar-haveli-and-daman-and-diu.json",
  "Delhi":"delhi.json",
  "Goa":"goa.json",
  "Gujarat":"gujarat.json",
  "Haryana":"haryana.json",
  "Himachal Pradesh":"himachal-pradesh.json",
  "Jammu and Kashmir":"jammu-and-kashmir.json",
  "Jharkhand":"jharkhand.json",
  "Karnataka":"karnataka.json",
  "Kerala":"kerala.json",
  "Ladakh":"ladakh.json",
  "Lakshadweep":"lakshadweep.json",
  "Madhya Pradesh":"madhya-pradesh.json",
  "Maharashtra":"maharashtra.json",
  "Manipur":"manipur.json",
  "Meghalaya":"meghalaya.json",
  "Mizoram":"mizoram.json",
  "Nagaland":"nagaland.json",
  "Odisha":"odisha.json",
  "Puducherry":"puducherry.json",
  "Punjab":"punjab.json",
  "Rajasthan":"rajasthan.json",
  "Sikkim":"sikkim.json",
  "Tamil Nadu":"tamil-nadu.json",
  "Telangana":"telangana.json",
  "Tripura":"tripura.json",
  "Uttar Pradesh":"uttar-pradesh.json",
  "Uttarakhand":"uttarakhand.json",
  "West Bengal":"west-bengal.json"

};

const stateKnowledgeBase = {};

await Promise.all(

  Object.entries(stateFiles).map(

    async ([stateName,fileName]) => {

      const response = await fetch(

        `./data/knowledge-base/laws/states/${fileName}`

      );

if (response.ok) {

    stateKnowledgeBase[stateName] =
        await response.json();

} else {

    throw new Error(
        `Missing knowledge base file: ${fileName}`
    );

}

    }

  )

);
  

/* ==========================================
     Debug
  ========================================== */

console.log(
"Central Laws Loaded",
Object.keys(
  centralKnowledgeBase
).length
);

console.log(
centralKnowledgeBase
);  

console.log(

"Resolver Test",

resolveCentralRule("EPFO-001")

);  

/* ==========================================
     Debug
  ========================================== */
  console.log(
    "GrowItWithHR V7 Engine Loaded Successfully"
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
   CENTRAL RULE RESOLVER
========================================== */

function resolveCentralRule(ruleId){

    if(!ruleId){

        return null;

    }

    for(const law of Object.values(centralKnowledgeBase)){

        if(!law){

            continue;

        }

        const collections = [];

        if(Array.isArray(law.rules))
            collections.push(law.rules);

        if(Array.isArray(law.mandatory))
            collections.push(law.mandatory);

        if(Array.isArray(law.recommended))
            collections.push(law.recommended);

        for(const group of collections){

            const found = group.find(rule=>rule.id===ruleId);

            if(found){

                return found;

            }

        }

    }

    return null;

}

/* ==========================================
   ADD CENTRAL RULE
========================================== */

function addCentralRule(targetArray, ruleId){

    const rule = resolveCentralRule(ruleId);

    if(rule){

        targetArray.push(rule);

    }

    else{

        console.warn(

            "Central Rule Not Found:",

            ruleId

        );

    }

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
   STATE KNOWLEDGE BASE
========================================== */

if (

  stateKnowledgeBase[state]

) {

  const stateData =

    stateKnowledgeBase[state];

  if (

    Array.isArray(stateData.rules)

  ) {

    stateData.rules.forEach(

      rule => {

        if (

          rule.priority === "Mandatory"

        ) {

          mandatory.push(rule);

        }

      }

    );

  }

  if (

    Array.isArray(stateData.recommended)

  ) {

    recommended.push(

      ...stateData.recommended

    );

  }

}
       /* ==========================================
   ENTITY KNOWLEDGE BASE
========================================== */

if (

  entityRules.entities

) {

  const selectedEntity =

    entityRules.entities.find(

      e => e.name === entity

    );

  if (

    selectedEntity

  ) {

    if (

      Array.isArray(selectedEntity.rules)

    ) {

      selectedEntity.rules.forEach(

        rule => {

          if (

            rule.priority === "Mandatory"

          ) {

            mandatory.push(rule);

          }

          else {

            recommended.push(rule);

          }

        }

      );

    }

  }

}
        /* ==========================================
   INDUSTRY KNOWLEDGE BASE
========================================== */

if (

  industryRules.industries

) {

  const selectedIndustry =

    industryRules.industries.find(

      i => i.name === industry

    );

  if (

    selectedIndustry

  ) {

    if (

      Array.isArray(selectedIndustry.rules)

    ) {

      selectedIndustry.rules.forEach(

        rule => {

          if (

            rule.priority === "Mandatory"

          ) {

            mandatory.push(rule);

          }

          else {

            recommended.push(rule);

          }

        }

      );

    }

  }

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
/* ---------------------------------------
   Resolve Central Law Rules
---------------------------------------- */

(rule.mandatoryRuleIds || []).forEach(

    ruleId => {

        const resolvedRule =

            resolveCentralRule(ruleId);

        if(resolvedRule){

            mandatory.push(

                resolvedRule

            );

        }

        else{

            console.warn(

                "Unknown Rule:",

                ruleId

            );

        }

    }

);

/* ---------------------------------------
   HR Advisory
---------------------------------------- */

recommended.push(

    ...(rule.recommended || [])

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

mandatory = [

  ...new Map(

    mandatory.map(

      rule => [

        rule.id || rule,

        rule

      ]

    )

  ).values()

];

recommended = [

  ...new Map(

    recommended.map(

      rule => [

        rule.id || rule,

        rule

      ]

    )

  ).values()

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

         mandatory.push({

          title:
            "No immediate mandatory requirements currently configured."

      });
        }

        if (
          recommended.length === 0
        ) {

          recommended.push({

          title:
          "No recommendations currently configured."

        });

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
        localStorage.setItem(
          "growitwithhrAssessment",
          JSON.stringify(reportData)
        );
        
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

        window.open(
  "advisory-dashboard.html",
  "_blank"
);
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
