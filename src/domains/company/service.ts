import { CompanyProfile } from "./types";

export function getTotalEmployees(profile: CompanyProfile): number {

    return (

        profile.workforce.permanent +

        profile.workforce.contract +

        profile.workforce.interns +

        profile.workforce.apprentices +

        profile.workforce.consultants +

        profile.workforce.gigWorkers

    );

}
