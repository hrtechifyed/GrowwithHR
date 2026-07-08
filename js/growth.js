/* ==========================================
   GrowItWithHR V8
   growth.js
   Growth Readiness Rendering
========================================== */

function renderGrowthReadiness(reportData) {
    const items = asArray(reportData.future);

    if (!items.length) {
        return renderEmptyState("No growth readiness actions were identified.");
    }

    return `
        <div class="growth-roadmap-grid">
            ${items.map(renderGrowthItem).join("")}
        </div>
    `;
}

function renderGrowthItem(item) {
    const title = formatRule(item);

    return `
        <article class="growth-card">
            <h3>${escapeHTML(title)}</h3>
            <p>${escapeHTML(getGrowthReason(title))}</p>
            <ul>
                <li><strong>Benefit:</strong> ${escapeHTML(getGrowthBenefit(title))}</li>
                <li><strong>Timeline:</strong> ${escapeHTML(getGrowthTimeline(title))}</li>
            </ul>
        </article>
    `;
}
