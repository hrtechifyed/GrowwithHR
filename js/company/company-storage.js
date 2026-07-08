class CompanyStorage {

    constructor() {

        this.storageKey = "growwithhr.company";

    }

    save(companyData) {

        try {

            localStorage.setItem(

                this.storageKey,

                JSON.stringify(companyData)

            );

            return true;

        } catch (error) {

            console.error("Unable to save Company Profile.", error);

            return false;

        }

    }

    load() {

        try {

            const data = localStorage.getItem(this.storageKey);

            if (!data) {

                return null;

            }

            return JSON.parse(data);

        } catch (error) {

            console.error("Unable to load Company Profile.", error);

            return null;

        }

    }

    exists() {

        return localStorage.getItem(this.storageKey) !== null;

    }

    remove() {

        localStorage.removeItem(this.storageKey);

    }

    update(updates) {

        const current = this.load() || {};

        const updated = {

            ...current,

            ...updates

        };

        this.save(updated);

    }

    clear() {

        localStorage.clear();

    }

}
