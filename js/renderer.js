/* ==========================================
   GrowItWithHR V8
   renderer.js
   Executive Dashboard Renderer
========================================== */

function getDashboardRoot() {
    return document.getElementById("dashboardRoot");
}

function escapeHTML(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function asArray(value) {
    return Array.isArray(value) ? value : [];
}

function getRuleTitle(rule) {
    return escapeHTML(formatRule(rule));
}

function renderMetricCard(label, value, note) {
    return `
        <div class="executive-metric-card">
            <span class="metric-label">${escapeHTML(label)}</span>
            <strong class="metric-value">${escapeHTML(value)}</strong>
            <span class="metric-note">${escapeHTML(note)}</span>
        </div>
    `;
}

function renderEmptyState(message) {
    return `
        <div class="empty-state">
            <p>${escapeHTML(message)}</p>
        </div>
    `;
}

function renderSectionShell(id, title, subtitle, content, expanded) {
    return `
        <section class="dashboard-accordion" id="${escapeHTML(id)}">
            <button class="accordion-trigger" type="button" aria-expanded="${expanded ? "true" : "false"}">
                <span>
                    <strong>${escapeHTML(title)}</strong>
                    <small>${escapeHTML(subtitle)}</small>
                </span>
                <span class="accordion-icon">+</span>
            </button>
            <div class="accordion-panel" ${expanded ? "" : "hidden"}>
                ${content}
            </div>
        </section>
    `;
}

function renderExecutiveSummary(reportData) {
    const mandatoryCount = asArray(reportData.mandatory).length;
    const recommendedCount = asArray(reportData.recommended).length;
    const futureCount = asArray(reportData.future).length;

    return `
        <div class="executive-summary-card">
            <div>
                <p class="eyebrow">Executive Summary</p>
                <h2>HR Compliance & Growth Readiness Snapshot</h2>
                <p>
                    Advisory assessment for <strong>${escapeHTML(reportData.entity)}</strong>
                    operating in <strong>${escapeHTML(reportData.state)}</strong>
                    within <strong>${escapeHTML(reportData.industry)}</strong>.
                </p>
            </div>
            <div class="executive-meta-grid">
                ${renderMetricCard("Employee Band", reportData.employeeBand || "Not specified", "Current scale")}
                ${renderMetricCard("Mandatory", mandatoryCount, "Compliance priorities")}
                ${renderMetricCard("Recommended", recommendedCount, "People practices")}
                ${renderMetricCard("Growth", futureCount, "Readiness actions")}
            </div>
        </div>
    `;
}

function renderDashboardLayout(reportData) {
    const root = getDashboardRoot();

    if (!root) {
        return;
    }

    root.innerHTML = `
        <div class="executive-dashboard" id="executiveDashboard">
            ${renderExecutiveSummary(reportData)}

            <div class="dashboard-workspace">
                <aside class="dashboard-sidebar">
                    <a href="#complianceSection">Compliance</a>
                    <a href="#peopleSection">People Strategy</a>
                    <a href="#growthSection">Growth Readiness</a>
                    <a href="#expansionSection">Expansion</a>
                    <button class="primary-btn" type="button" id="downloadReportButton">Download PDF</button>
                </aside>

                <main class="dashboard-content">
                    ${renderSectionShell(
                        "complianceSection",
                        "Statutory Compliance",
                        "Mandatory obligations and actions",
                        typeof renderCompliance === "function" ? renderCompliance(reportData) : renderEmptyState("Compliance module is not loaded."),
                        true
                    )}
                    ${renderSectionShell(
                        "peopleSection",
                        "People Strategy",
                        "Recommended HR governance practices",
                        typeof renderPeopleStrategy === "function" ? renderPeopleStrategy(reportData) : renderEmptyState("People module is not loaded."),
                        false
                    )}
                    ${renderSectionShell(
                        "growthSection",
                        "Growth Readiness",
                        "Future operating model recommendations",
                        typeof renderGrowthReadiness === "function" ? renderGrowthReadiness(reportData) : renderEmptyState("Growth module is not loaded."),
                        false
                    )}
                    ${renderSectionShell(
                        "expansionSection",
                        "Expansion Advisor",
                        "State comparison and expansion readiness",
                        typeof renderExpansionAdvisor === "function" ? renderExpansionAdvisor(reportData) : renderEmptyState("Expansion module is not loaded."),
                        false
                    )}
                </main>
            </div>
        </div>
    `;

    bindAccordionEvents();
    bindDashboardActions(reportData);
}

function bindAccordionEvents() {
    document.querySelectorAll(".accordion-trigger").forEach(trigger => {
        trigger.addEventListener("click", () => {
            const panel = trigger.nextElementSibling;
            const expanded = trigger.getAttribute("aria-expanded") === "true";

            trigger.setAttribute("aria-expanded", String(!expanded));

            if (panel) {
                panel.hidden = expanded;
            }
        });
    });
}

function bindDashboardActions(reportData) {
    const downloadButton = document.getElementById("downloadReportButton");

    if (downloadButton) {
        downloadButton.addEventListener("click", () => {
            if (typeof openPDFModal === "function") {
                openPDFModal(reportData);
            }
        });
    }
}
