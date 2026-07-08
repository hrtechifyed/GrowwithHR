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

  static deepMerge(target, source) {

    if (!source || typeof source !== "object") {
      return structuredClone(target);
    }

    const output = structuredClone(target);

    Object.keys(source).forEach((key) => {

      const sourceValue = source[key];
      const targetValue = output[key];

      if (Array.isArray(sourceValue)) {
        output[key] = [...sourceValue];
        return;
      }

      if (
        sourceValue &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue)
      ) {
        output[key] = CompanyDNA.deepMerge(
          targetValue ?? {},
          sourceValue
        );
        return;
      }

      output[key] = sourceValue;

    });

    return output;

  }

  validate() {

    const errors = [];

    if (!this.data.company.legalName.trim()) {
      errors.push("Company legal name is required.");
    }

    if (!this.data.company.entityType.trim()) {
      errors.push("Entity type is required.");
    }

    if (!this.data.industry.sector.trim()) {
      errors.push("Industry sector is required.");
    }

    if (!this.data.geography.headquarters.state.trim()) {
      errors.push("Headquarters state is required.");
    }

    if (!this.data.geography.headquarters.city.trim()) {
      errors.push("Headquarters city is required.");
    }

    if (this.data.workforce.totalEmployees < 0) {
      errors.push("Employee count cannot be negative.");
    }

    return {
      valid: errors.length === 0,
      errors
    };

  }

  getSnapshot() {

    return Object.freeze(structuredClone(this.data));

  }

  export() {

    return JSON.stringify(this.data, null, 2);

  }

  import(json) {

    const parsed = JSON.parse(json);

    this.data = CompanyDNA.deepMerge(
      DEFAULT_COMPANY_DNA,
      parsed
    );

    this.touch();

    return this;

  }

  getCompanyProfile() {

    return structuredClone(this.data.company);

  }

  getIndustryProfile() {

    return structuredClone(this.data.industry);

  }

  getGeographyProfile() {

    return structuredClone(this.data.geography);

  }

  getWorkforceProfile() {

    return structuredClone(this.data.workforce);

  }

  getOrganizationProfile() {

    return structuredClone(this.data.organization);

  }

  getBusinessProfile() {

    return structuredClone(this.data.business);

  }

  getComplianceProfile() {

    return structuredClone(this.data.compliance);

  }

  updateCompany(profile) {

    this.data.company = CompanyDNA.deepMerge(
      this.data.company,
      profile
    );

    this.touch();

    return this;

  }

  updateIndustry(profile) {

    this.data.industry = CompanyDNA.deepMerge(
      this.data.industry,
      profile
    );

    this.touch();

    return this;

  }

  updateGeography(profile) {

    this.data.geography = CompanyDNA.deepMerge(
      this.data.geography,
      profile
    );

    this.touch();

    return this;

  }

  updateWorkforce(profile) {

    this.data.workforce = CompanyDNA.deepMerge(
      this.data.workforce,
      profile
    );

    this.touch();

    return this;

  }

  updateOrganization(profile) {

    this.data.organization = CompanyDNA.deepMerge(
      this.data.organization,
      profile
    );

    this.touch();

    return this;

  }

  updateBusiness(profile) {

    this.data.business = CompanyDNA.deepMerge(
      this.data.business,
      profile
    );

    this.touch();

    return this;

  }

  updateCompliance(profile) {

    this.data.compliance = CompanyDNA.deepMerge(
      this.data.compliance,
      profile
    );

    this.touch();

    return this;

  }

  getOrganizationSize() {

    const employees = this.data.workforce.totalEmployees;

    if (employees <= 10) {
      return "Startup";
    }

    if (employees <= 50) {
      return "Small";
    }

    if (employees <= 250) {
      return "Medium";
    }

    if (employees <= 1000) {
      return "Large";
    }

    return "Enterprise";

  }

  getGrowthStage() {

    return this.data.business.growthStage;

  }

  getPrimaryState() {

    return this.data.geography.headquarters.state;

  }

  getPrimaryCity() {

    return this.data.geography.headquarters.city;

  }

  getEntityType() {

    return this.data.company.entityType;

  }

  getIndustry() {

    return this.data.industry.sector;

  }

  getBusinessModel() {

    return this.data.business.businessModel;

  }

  hasFactories() {

    return this.data.organization.factories.length > 0;

  }

  hasBranches() {

    return this.data.organization.branches.length > 0;

  }

  hasRemoteEmployees() {

    return this.data.workforce.remoteEmployees > 0;

  }

  hasContractEmployees() {

    return this.data.workforce.contractEmployees > 0;

  }

  summary() {

    return {
      company: this.getCompanyProfile(),
      industry: this.getIndustry(),
      entity: this.getEntityType(),
      geography: this.getGeographyProfile(),
      workforce: this.getWorkforceProfile(),
      organization: this.getOrganizationProfile(),
      business: this.getBusinessProfile(),
      compliance: this.getComplianceProfile(),
      organizationSize: this.getOrganizationSize(),
      growthStage: this.getGrowthStage()
    };

  }

}

const companyDNA = new CompanyDNA();

export default companyDNA;
