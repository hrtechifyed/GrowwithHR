document.addEventListener("DOMContentLoaded", async () => {

  try {

    // -------------------------
    // Load Updates
    // -------------------------

    const updatesResponse =
      await fetch("./data/updates.json");

    const updatesData =
      await updatesResponse.json();

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

    // -------------------------
    // Load States
    // -------------------------

    const statesResponse =
      await fetch("./data/states.json");

    const statesData =
      await statesResponse.json();

    const stateSelect =
      document.getElementById("stateSelect");

    if (stateSelect) {

      const allLocations = [
        ...statesData.states,
        ...statesData.unionTerritories
      ];

      allLocations.forEach(state => {

        const option =
          document.createElement("option");

        option.value = state;
        option.textContent = state;

        stateSelect.appendChild(option);

      });

    }

    // -------------------------
    // Load Entity Types
    // -------------------------

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

    // -------------------------
    // Load Industries
    // -------------------------

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

    // -------------------------
    // Generate Assessment
    // -------------------------

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

          let score = 72;
          let risk = "Medium";
          let stage = "Scaling Business";

          if (
            employeeCount === "1-5" ||
            employeeCount === "6-9"
          ) {

            score = 55;
            risk = "Low";
            stage = "Founder Led";

          }

          if (
            employeeCount === "50-99" ||
            employeeCount === "100-249"
          ) {

            score = 78;
            risk = "Medium";
            stage = "Structured Growth";

          }

          if (
            employeeCount === "250-499" ||
            employeeCount === "500-999" ||
            employeeCount === "1000-4999"
          ) {

            score = 84;
            risk = "High";
            stage = "Enterprise";

          }

          reportContainer.innerHTML = `

          <div class="example-card">

          <h2>Compliance Assessment Report</h2>

          <p>
          <strong>State:</strong> ${state}
          </p>

          <p>
          <strong>Entity Type:</strong> ${entity}
          </p>

          <p>
          <strong>Industry:</strong> ${industry}
          </p>

          <p>
          <strong>Employee Count:</strong> ${employeeCount}
          </p>

          <hr>

          <h3>
          Compliance Readiness Score
          </h3>

          <p>
          <strong>${score}/100</strong>
          </p>

          <p>
          Beta Score –
          illustrative only.
          </p>

          <h3>
          Risk Rating
          </h3>

          <p>
          ${risk}
          </p>

          <h3>
          Growth Stage
          </h3>

          <p>
          ${stage}
          </p>

          <h3>
          Executive Summary
          </h3>

          <p>
          Based on the selected profile,
          the organisation appears to be in
          a growth phase requiring structured
          compliance governance and people
          operations planning.
          </p>

          <h3>
          Mandatory Compliance Actions
          </h3>

          <ul>
          <li>✓ Shops & Establishments Review</li>
          <li>✓ Employment Documentation Review</li>
          <li>✓ Payroll Compliance Review</li>
          <li>✓ POSH Compliance Assessment</li>
          </ul>

          <h3>
          Recommended HR Actions
          </h3>

          <ul>
          <li>
          Priority 1:
          Employee Handbook
          (0-30 Days)
          </li>

          <li>
          Priority 2:
          Performance Framework
          (30-90 Days)
          </li>

          <li>
          Priority 3:
          Manager Capability Program
          (60-180 Days)
          </li>

          <li>
          Priority 4:
          Workforce Planning
          (90-365 Days)
          </li>

          </ul>

          <h3>
          Sources
          </h3>

          <ul>
          <li>
            <a href="https://labour.gov.in" target="_blank">
            Ministry of Labour & Employment
            </a>
        </li>

        <li>
            <a href="https://epfindia.gov.in" target="_blank">
            Provident Fund
            </a>
        </li>

          <li>
            <a href="https://esic.gov.in" target="_blank">
            ESIC
            </a>
          </li>
          
          <li>
            <a href="https://indiacode.nic.in" target="_blank">
            IndiaCode
            </a>
          </li>
          
          <p>
          <strong>
          Last Verified:
          </strong>
          ${updatesData.lastVerified}
          </p>

          </div>

          `;

        }

      );

    }

  } catch (error) {

    console.error(error);

  }

});
