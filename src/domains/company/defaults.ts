import { CompanyProfile } from "./types";

export const EmptyCompanyProfile: CompanyProfile = {

    id: "",

    companyName: "",

    entityType: "Private Limited",

    industry: "",

    natureOfBusiness: "",

    yearIncorporated: new Date().getFullYear(),

    countries: ["India"],

    states: [],

    cities: [],

    workforce: {

        permanent: 0,

        contract: 0,

        interns: 0,

        apprentices: 0,

        consultants: 0,

        gigWorkers: 0

    },

    workModel: "Office",

    projectedEmployees: 0,

    expansionPlanned: false,

    internationalHiring: false

};
