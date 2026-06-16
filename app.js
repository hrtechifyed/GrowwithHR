document.addEventListener("DOMContentLoaded", async () => {

  try {

    // =========================================
    // LOAD UPDATES
    // =========================================

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

    // =========================================
    // LOAD STATES
    // =========================================

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

    // =========================================
    // LOAD ENTITY TYPES
    // =========================================

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

    // =========================================
    // LOAD INDUSTRIES
    // =========================================

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

    // =========================================
    // GENERATE REPORT
    // =========================================

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
            employeeCount === "1000-4999" ||
            employeeCount === "5000-9999" ||
            employeeCount === "10000-24999" ||
            employeeCount === "25000-49999" ||
            employeeCount === "50000-99999" ||
            employeeCount === "100000+"
          ) {

            score = 84;
            risk = "High";
            stage = "Enterprise";

          }

          reportContainer.innerHTML = `

          <div class="example-card">

          <div class="report-header">

          <img
          src="assets/hrtechify-logo.png"
          alt="HRTechify Logo"
          class="report-logo">

          <div>

          <h2>
          GrowItWithHR Assessment Report
          </h2>

          <p>
          Generated On:
          ${new Date().toLocaleDateString()}
          </p>

          </div>

          </div>

          <hr>

          <p><strong>State:</strong> ${state}</p>
          <p><strong>Entity Type:</strong> ${entity}</p>
          <p><strong>Industry:</strong> ${industry}</p>
          <p><strong>Employee Count:</strong> ${employeeCount}</p>

          <div class="score-box">

          <h2>${score}/100</h2>

          <p>
          Compliance Readiness Score
          </p>

          <div class="risk-badge">
          ${risk} Risk
          </div>

          </div>

          <h3>Growth Stage</h3>

          <p>${stage}</p>

          <div class="report-highlight">

          <h3>Executive Summary</h3>

          <p>
          Based on the selected profile, the organisation appears to be in a growth phase requiring structured compliance governance, workforce planning and people operations maturity.
          </p>

          </div>

          <h3>Mandatory Compliance Actions</h3>

          <ul>
            <li>✓ Shops & Establishments Review</li>
            <li>✓ Employment Documentation Review</li>
            <li>✓ Payroll Compliance Review</li>
            <li>✓ POSH Compliance Assessment</li>
          </ul>

          <h3>Recommended HR Actions</h3>

          <ul>
            <li>🔴 Employee Handbook (0–30 Days)</li>
            <li>🟠 Performance Framework (30–90 Days)</li>
            <li>🟡 Manager Capability Program (60–180 Days)</li>
            <li>🟢 Workforce Planning Framework (90–365 Days)</li>
          </ul>

          <h3>Official Sources</h3>

          <ul>

          <li>
          <a href="https://labour.gov.in" target="_blank">
          Ministry of Labour & Employment
          </a>
          </li>

          <li>
          <a href="https://www.epfindia.gov.in" target="_blank">
          Employees' Provident Fund Organisation (EPFO)
          </a>
          </li>

          <li>
          <a href="https://www.esic.gov.in" target="_blank">
          Employees' State Insurance Corporation (ESIC)
          </a>
          </li>

          <li>
          <a href="https://www.indiacode.nic.in" target="_blank">
          India Code
          </a>
          </li>

          </ul>

          <p>
          <strong>Last Verified:</strong>
          ${updatesData.lastVerified}
          </p>

          <p>
          <strong>Disclaimer:</strong>
          This assessment is for informational purposes only and should not be considered legal advice.
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
      "Assessment Engine Error",
      error
    );

  }

});

