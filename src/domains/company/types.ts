export type EntityType =
  | "Private Limited"
  | "Public Limited"
  | "LLP"
  | "Partnership"
  | "Proprietorship"
  | "Section 8"
  | "Government"
  | "Other";

export type WorkModel =
  | "Office"
  | "Remote"
  | "Hybrid"
  | "Factory"
  | "Retail"
  | "Warehouse";

export interface Workforce {
  permanent: number;
  contract: number;
  interns: number;
  apprentices: number;
  consultants: number;
  gigWorkers: number;
}

export interface CompanyProfile {

  id: string;

  companyName: string;

  entityType: EntityType;

  industry: string;

  natureOfBusiness: string;

  yearIncorporated: number;

  countries: string[];

  states: string[];

  cities: string[];

  workforce: Workforce;

  workModel: WorkModel;

  projectedEmployees: number;

  expansionPlanned: boolean;

  internationalHiring: boolean;

}
