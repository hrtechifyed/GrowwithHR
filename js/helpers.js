/* ==========================================
   GrowItWithHR V8
   helpers.js
   Shared Helper Functions
========================================== */

function formatRule(item) {

    if (typeof item === "string") {
        return item;
    }

    if (item && typeof item === "object") {
        return item.title || item.name || "";
    }

    return "";

}

/* ==========================================
   RULE EXPLANATIONS
========================================== */

function getRuleExplanation(rule) {

    const title = (rule.title || "").toLowerCase();

    if (title.includes("epf")) {
        return "This requirement applies because establishments meeting the prescribed applicability criteria must comply with the Employees' Provident Funds and Miscellaneous Provisions Act, 1952.";
    }

    if (title.includes("esic")) {
        return "This requirement applies because eligible establishments are required to comply with the Employees' State Insurance Act, 1948.";
    }

    if (title.includes("posh")) {
        return "Employers are expected to establish workplace sexual harassment prevention mechanisms under the POSH framework.";
    }

    if (title.includes("gratuity")) {
        return "This obligation relates to statutory gratuity payments for eligible employees.";
    }

    if (title.includes("bonus")) {
        return "This obligation relates to statutory payment of bonus requirements.";
    }

    if (title.includes("maternity")) {
        return "This obligation relates to maternity benefit compliance.";
    }

    return "This requirement has been identified by evaluating your organisation profile against the GrowItWithHR Knowledge Base.";

}

/* ==========================================
   AUTHORITIES
========================================== */

function getAuthorityName(sourceId) {

    switch (sourceId) {

        case "EPFO":
            return "Employees' Provident Fund Organisation";

        case "ESIC":
            return "Employees' State Insurance Corporation";

        case "INDIACODE":
            return "India Code";

        case "LABOUR":
            return "Ministry of Labour & Employment";

        default:
            return "Government Authority";

    }

}

function getAuthorityURL(sourceId) {

    switch (sourceId) {

        case "EPFO":
            return "https://www.epfindia.gov.in";

        case "ESIC":
            return "https://www.esic.gov.in";

        case "INDIACODE":
            return "https://www.indiacode.nic.in";

        case "LABOUR":
            return "https://labour.gov.in";

        default:
            return "https://labour.gov.in";

    }

}

/* ==========================================
   NEXT ACTIONS
========================================== */

function getNextActions(rule) {

    const title = (rule.title || "").toLowerCase();

    if (title.includes("epf")) {

        return [
            "Review EPF applicability.",
            "Register with EPFO if applicable.",
            "Enroll eligible employees.",
            "Deposit monthly contributions.",
            "Maintain statutory records."
        ];

    }

    if (title.includes("esic")) {

        return [
            "Review ESIC applicability.",
            "Register establishment.",
            "Register eligible employees.",
            "Deposit contributions.",
            "Maintain statutory records."
        ];

    }

    if (title.includes("posh")) {

        return [
            "Review applicability.",
            "Constitute Internal Committee.",
            "Publish POSH Policy.",
            "Conduct awareness sessions.",
            "Maintain complaint records."
        ];

    }

    if (title.includes("gratuity")) {

        return [
            "Review employee eligibility.",
            "Maintain service records.",
            "Calculate gratuity correctly.",
            "Maintain documentation."
        ];

    }

    return [

        "Review the requirement.",
        "Implement the process.",
        "Maintain documentation.",
        "Review periodically."

    ];

}

/* ==========================================
   PEOPLE STRATEGY
========================================== */

function getRecommendationReason(item) {

    const text = item.toLowerCase();

    if (text.includes("handbook"))
        return "Improves policy communication and consistency.";

    if (text.includes("performance"))
        return "Builds accountability and employee development.";

    if (text.includes("manager"))
        return "Develops leadership capability.";

    if (text.includes("workforce"))
        return "Supports future hiring decisions.";

    return "Strengthens HR governance.";

}

function getRecommendationBenefit(item) {

    const text = item.toLowerCase();

    if (text.includes("handbook"))
        return "Improves employee experience.";

    if (text.includes("performance"))
        return "Supports organisational performance.";

    if (text.includes("manager"))
        return "Creates stronger people managers.";

    if (text.includes("workforce"))
        return "Improves workforce planning.";

    return "Improves governance maturity.";

}

function getRecommendationTimeline(item) {

    const text = item.toLowerCase();

    if (text.includes("handbook"))
        return "0–30 Days";

    if (text.includes("performance"))
        return "30–90 Days";

    if (text.includes("manager"))
        return "60–180 Days";

    return "As the organisation grows.";

}

/* ==========================================
   GROWTH READINESS
========================================== */

function getGrowthReason(item) {

    const text = item.toLowerCase();

    if (text.includes("hris"))
        return "Supports efficient HR operations.";

    if (text.includes("analytics"))
        return "Enables data-driven workforce decisions.";

    if (text.includes("leadership"))
        return "Builds future organisational capability.";

    if (text.includes("succession"))
        return "Improves business continuity.";

    return "Supports sustainable growth.";

}

function getGrowthBenefit(item) {

    const text = item.toLowerCase();

    if (text.includes("hris"))
        return "Improves HR efficiency.";

    if (text.includes("analytics"))
        return "Supports better decision making.";

    if (text.includes("leadership"))
        return "Develops future leaders.";

    if (text.includes("succession"))
        return "Reduces organisational risk.";

    return "Supports long-term growth.";

}

function getGrowthTimeline(item) {

    const text = item.toLowerCase();

    if (text.includes("hris"))
        return "6–12 Months";

    if (text.includes("analytics"))
        return "After HRIS";

    if (text.includes("leadership"))
        return "3–6 Months";

    if (text.includes("succession"))
        return "Before 250 Employees";

    return "As Needed";

}
