/* ==========================================
   GrowWithHR  V0.9.0-beta
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
    const category = rule && rule.category ? rule.category : getComplianceCategory(rule || {});

    return `
        <article class="compliance-card rule-card">
            <details ${index === 0 ? "open" : ""}>
                <summary class="rule-summary">
                    <span class="priority-dot" aria-hidden="true">🟠</span>
                    <span class="rule-summary-copy">
                        <span class="rule-priority">Mandatory</span>
                        <strong>${title}</strong>
                        <small>${escapeHTML(category)}</small>
                    </span>
                    <span class="expand-label">Expand ▼</span>
                </summary>

                <div class="rule-detail-block">
                    <h4>Why this applies</h4>
                    <p>${escapeHTML(getRuleExplanation(rule || {}))}</p>
                </div>

                <div class="rule-detail-block">
                    <h4>Official Sources</h4>
                    <div class="source-links">
                        <a href="${escapeHTML(authorityURL)}" target="_blank" rel="noopener noreferrer">${escapeHTML(authorityName)}</a>
                        <a href="https://www.indiacode.nic.in" target="_blank" rel="noopener noreferrer">India Code</a>
                    </div>
                </div>

                <div class="rule-detail-block">
                    <h4>Next Actions</h4>
                    <ul class="action-list check-list">
                        ${actions.map(action => `<li>${escapeHTML(action)}</li>`).join("")}
                    </ul>
                </div>
            </details>
        </article>
    `;
}
