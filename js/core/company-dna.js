/**
 * GrowWithHR Intelligence Platform
 * Company DNA Engine
 * Version: 1.0.0
 */

export const COMPANY_DNA_VERSION = "1.0.0";

export const DEFAULT_COMPANY_DNA = Object.freeze({
  company: {
    legalName: "",
    displayName: "",
    entityType: "",
    incorporationDate: "",
    cin: "",
    pan: "",
    tan: "",
    gstin: ""
  },

  industry: {
    sector: "",
    subSector: "",
    nicCode: "",
    businessActivities: []
  },

  geography: {
    headquarters: {
      country: "India",
      state: "",
      city: ""
    },

    operatingStates: [],
    operatingCities: [],
    countries: ["India"]
  },

  workforce: {
    totalEmployees: 0,
    permanentEmployees: 0,
    contractEmployees: 0,
    apprentices: 0,
    interns: 0,
    consultants: 0,
    remoteEmployees: 0,
    womenEmployees: 0,
    disabledEmployees: 0
  },

  organization: {
    departments: [],
    reportingLevels: 0,
    businessUnits: [],
    branches: [],
    factories: [],
    offices: []
  },

  business: {
    businessModel: "",
    fundingStage: "",
    growthStage: "",
    annualRevenue: "",
    payrollFrequency: "",
    financialYear: "April-March"
  },

  compliance: {
    registrations: [],
    licenses: [],
    policies: [],
    applicableActs: [],
    statutoryBodies: []
  },

  metadata: {
    createdAt: "",
    updatedAt: "",
    createdBy: "",
    updatedBy: "",
    version: COMPANY_DNA_VERSION
  }
});

export class CompanyDNA {

  constructor(initialData = {}) {
    this.data = structuredClone(DEFAULT_COMPANY_DNA);
    this.merge(initialData);
  }

  merge(source = {}) {
    this.data = CompanyDNA.deepMerge(this.data, source);
    this.touch();
    return this;
  }

  reset() {
    this.data = structuredClone(DEFAULT_COMPANY_DNA);
    return this;
  }

  get() {
    return structuredClone(this.data);
  }

  getSection(section) {
    return structuredClone(this.data[section]);
  }

  setSection(section, value) {
    this.data[section] = structuredClone(value);
    this.touch();
    return this;
  }

  update(path, value) {

    const keys = path.split(".");
    let current = this.data;

    while (keys.length > 1) {
      const key = keys.shift();

      if (!(key in current)) {
        current[key] = {};
      }

      current = current[key];
    }

    current[keys[0]] = value;

    this.touch();

    return this;
  }

  read(path) {

    return path
      .split(".")
      .reduce((obj, key) => obj?.[key], this.data);

  }

  touch() {
    this.data.metadata.updatedAt = new Date().toISOString();
  }
