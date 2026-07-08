/* ==========================================
   GrowItWithHR V8
   compliance.js
   Compliance Rendering
========================================== */

function renderCompliance(reportData) {
    const rules = asArray(reportData.mandatory);

    if (!rules.length) {
        return renderEmptyState("No mandatory compliance requirements were identified.");
    }

    return `
        <div class="compliance-list">
            ${rules.map(renderComplianceRule).join("")}
        </div>
    `;
}

function renderComplianceRule(rule, index) {
    const title = getRuleTitle(rule);
    const sourceId = rule && rule.sourceId ? rule.sourceId : rule && rule.source ? rule.source : "LABOUR";
    const authorityName = getAuthorityName(sourceId);
    const authorityURL = getAuthorityURL(sourceId);
    const actions = getNextActions(rule || {});

    return `
        <article class="compliance-card">
            <div class="card-header-row">
                <span class="sequence-pill">${index + 1}</span>
                <div>
                    <h3>${title}</h3>
                    <p>${escapeHTML(getRuleExplanation(rule || {}))}</p>
                </div>
            </div>

            <div class="authority-box">
                <span>Authority</span>
                <a href="${escapeHTML(authorityURL)}" target="_blank" rel="noopener noreferrer">
                    ${escapeHTML(authorityName)}
                </a>
            </div>

            <h4>Next Actions</h4>
            <ol class="action-list">
                ${actions.map(action => `<li>${escapeHTML(action)}</li>`).join("")}
            </ol>
        </article>
    `;
}
