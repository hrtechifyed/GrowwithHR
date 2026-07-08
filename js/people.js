/* ==========================================
   GrowItWithHR V8
   people.js
   People Strategy Rendering
========================================== */

function renderPeopleStrategy(reportData) {
    const recommendations = asArray(reportData.recommended);

    if (!recommendations.length) {
        return renderEmptyState("No people strategy recommendations were identified.");
    }

    return `
        <div class="strategy-grid">
            ${recommendations.map(renderPeopleRecommendation).join("")}
        </div>
    `;
}

function renderPeopleRecommendation(item) {
    const title = formatRule(item);

    return `
        <article class="strategy-card">
            <h3>${escapeHTML(title)}</h3>
            <p>${escapeHTML(getRecommendationReason(title))}</p>
            <dl>
                <div>
                    <dt>Business Benefit</dt>
                    <dd>${escapeHTML(getRecommendationBenefit(title))}</dd>
                </div>
                <div>
                    <dt>Suggested Timeline</dt>
                    <dd>${escapeHTML(getRecommendationTimeline(title))}</dd>
                </div>
            </dl>
        </article>
    `;
}
