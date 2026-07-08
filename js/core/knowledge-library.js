/**
 * =============================================================================
 * GrowWithHR Intelligence Platform
 * Knowledge Library
 * -----------------------------------------------------------------------------
 * File      : js/core/knowledge-library.js
 * Version   : 1.0.0
 * =============================================================================
 */

import { STORAGE, EVENTS } from "../shared/constants/index.js";
import {
    createId,
    cloneObject,
    immutable,
    timestamp
} from "../shared/utils/index.js";

import persistence from "./persistence.js";
import eventBus from "./event-bus.js";
import logger from "./logger.js";

class KnowledgeLibrary {

    constructor() {

        this.library = this.load();

    }

    defaultLibrary() {

        return {

            version: "1.0.0",

            lastUpdated: timestamp(),

            categories: {

                laws: [],

                frameworks: [],

                templates: [],

                policies: [],

                sop: [],

                guides: [],

                notifications: [],

                forms: [],

                registers: [],

                returns: [],

                licenses: [],

                benchmarks: [],

                industries: [],

                faqs: []

            }

        };

    }

    load() {

        return persistence.load(
            STORAGE.KNOWLEDGE_LIBRARY,
            this.defaultLibrary()
        );

    }

    save() {

        this.library.lastUpdated = timestamp();

        persistence.save(
            STORAGE.KNOWLEDGE_LIBRARY,
            this.library
        );

        eventBus.emit(
            EVENTS.KNOWLEDGE_LIBRARY_LOADED,
            this.snapshot()
        );

    }

    snapshot() {

        return immutable(this.library);

    }

    get() {

        return this.snapshot();

    }

    getCategory(category) {

        return cloneObject(
            this.library.categories[category] || []
        );

    }

    categories() {

        return Object.keys(
            this.library.categories
        );

    }

    exists(category) {

        return category in this.library.categories;

    }

    add(category, record) {

        if (!this.exists(category)) {

            throw new Error(
                `Unknown category '${category}'.`
            );

        }

        const item = {

            id: createId(category),

            createdAt: timestamp(),

            updatedAt: timestamp(),

            ...record

        };

        this.library.categories[category].push(item);

        this.save();

        logger.info(
            "Knowledge record added.",
            {
                category,
                id: item.id
            }
        );

        return cloneObject(item);

    }

    update(category, id, updates) {

        const records = this.library.categories[category];

        if (!records) {

            throw new Error(
                `Unknown category '${category}'.`
            );

        }

        const index = records.findIndex(
            record => record.id === id
        );

        if (index === -1) {

            throw new Error(
                `Record '${id}' not found.`
            );

        }

        records[index] = {

            ...records[index],

            ...updates,

            updatedAt: timestamp()

        };

        this.save();

        logger.info(
            "Knowledge record updated.",
            {
                category,
                id
            }
        );

        return cloneObject(records[index]);

    }

    remove(category, id) {

        const records = this.library.categories[category];

        if (!records) {

            throw new Error(
                `Unknown category '${category}'.`
            );

        }

        const index = records.findIndex(
            record => record.id === id
        );

        if (index === -1) {

            return false;

        }

        records.splice(index, 1);

        this.save();

        logger.info(
            "Knowledge record removed.",
            {
                category,
                id
            }
        );

        return true;

    }

    search(keyword = "") {

        const query = keyword
            .trim()
            .toLowerCase();

        const results = [];

        Object.entries(this.library.categories)
            .forEach(([category, records]) => {

                records.forEach(record => {

                    const searchable = JSON.stringify(record)
                        .toLowerCase();

                    if (searchable.includes(query)) {

                        results.push({

                            category,

                            ...cloneObject(record)

                        });

                    }

                });

            });

        return results;

    }

    clear() {

        this.library = this.defaultLibrary();

        this.save();

        logger.info(
            "Knowledge library cleared."
        );

    }

}

const knowledgeLibrary = new KnowledgeLibrary();

export { KnowledgeLibrary };

export default knowledgeLibrary;
