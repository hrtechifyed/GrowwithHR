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
        .replace(/\"/g, "&quot;")
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
                <span class="accordion-icon">${expanded ? "−" : "+"}</span>
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
    const totalActions = mandatoryCount + recommendedCount + futureCount;

    return `
        <section class="executive-summary-card executive-summary-hero" aria-labelledby="executiveSummaryTitle">
            <div class="summary-hero-copy">
                <p class="eyebrow">Executive Compliance Summary</p>
                <h2 id="executiveSummaryTitle">A single executive view of obligations, governance, and growth readiness.</h2>
                <p>
                    Advisory assessment for <strong>${escapeHTML(reportData.entity)}</strong>
                    operating in <strong>${escapeHTML(reportData.state)}</strong>
                    within <strong>${escapeHTML(reportData.industry)}</strong>.
                </p>
            </div>

            <div class="executive-profile-strip" aria-label="Assessment profile">
                ${renderMetricCard("State", reportData.state || "Not specified", "Operating location")}
                ${renderMetricCard("Entity", reportData.entity || "Not specified", "Business profile")}
                ${renderMetricCard("Industry", reportData.industry || "Not specified", "Sector lens")}
                ${renderMetricCard("Employees", reportData.employeeBand || "Not specified", "Current scale")}
            </div>

            <div class="executive-meta-grid executive-status-grid">
                ${renderMetricCard("Mandatory", mandatoryCount, "Compliance obligations")}
                ${renderMetricCard("Recommendations", recommendedCount, "HR governance")}
                ${renderMetricCard("Future", futureCount, "Organisation growth")}
                ${renderMetricCard("Status", totalActions ? "Action Required" : "No Actions", "Advisory outcome")}
            </div>
        </section>
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

            <div class="journey-rail" aria-label="Dashboard journey">
                <span>1 Executive Summary</span>
                <span>2 Choose a Category</span>
                <span>3 Expand a Rule</span>
                <span>4 Official Sources</span>
                <span>5 Download</span>
            </div>

            <div class="dashboard-workspace">
                <aside class="dashboard-sidebar" aria-label="Advisory categories">
                    <a href="#complianceSection">Compliance <span>View →</span></a>
                    <a href="#peopleSection">People <span>View →</span></a>
                    <a href="#growthSection">Growth <span>View →</span></a>
                    <a href="#expansionSection">Expansion <span>View →</span></a>
                    <div class="download-actions">
                        <button class="primary-btn" type="button" id="downloadReportButton">Download Report</button>
                        <button class="primary-btn" type="button" id="downloadPackButton">Download Advisory Pack</button>
                    </div>
                </aside>

                <main class="dashboard-content">
                    ${renderSectionShell(
                        "complianceSection",
                        "Compliance Obligations",
                        "Mandatory statutory obligations and next actions",
                        typeof renderCompliance === "function" ? renderCompliance(reportData) : renderEmptyState("Compliance module is not loaded."),
                        true
                    )}
                    ${renderSectionShell(
                        "peopleSection",
                        "HR Governance",
                        "Recommended people practices",
                        typeof renderPeopleStrategy === "function" ? renderPeopleStrategy(reportData) : renderEmptyState("People module is not loaded."),
                        false
                    )}
                    ${renderSectionShell(
                        "growthSection",
                        "Organisation Growth",
                        "Future operating model recommendations",
                        typeof renderGrowthReadiness === "function" ? renderGrowthReadiness(reportData) : renderEmptyState("Growth module is not loaded."),
                        false
                    )}
                    ${renderSectionShell(
                        "expansionSection",
                        "Expansion Planner",
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

            const icon = trigger.querySelector(".accordion-icon");
            if (icon) {
                icon.textContent = expanded ? "+" : "−";
            }

            if (panel) {
                panel.hidden = expanded;
            }
        });
    });
}

function bindDashboardActions(reportData) {
    const downloadButtons = [
        document.getElementById("downloadReportButton"),
        document.getElementById("downloadPackButton")
    ];

    downloadButtons.forEach(button => {
        if (button) {
            button.addEventListener("click", () => {
                if (typeof openPDFModal === "function") {
                    openPDFModal(reportData);
                }
            });
        }
    });
}
