/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * AI Advisor Module
 * -----------------------------------------------------------------------------
 * File      : js/advisor/index.js
 * Version   : 1.0.0
 * =============================================================================
 */

import advisorService from "./service.js";

class AIAdvisor {

    analyze(context = {}) {

        return advisorService.analyze(
            context
        );

    }

    summary(context = {}) {

        return advisorService.summary(
            context
        );

    }

    recommendations(context = {}) {

        return advisorService
            .recommendations(context);

    }

    priorities(context = {}) {

        return advisorService
            .priorities(context);

    }

}

const aiAdvisor =
    new AIAdvisor();

export { AIAdvisor };

export default aiAdvisor;
