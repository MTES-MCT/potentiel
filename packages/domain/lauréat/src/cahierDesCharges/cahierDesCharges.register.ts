import {
  ConsulterCahierDesChargesDependencies,
  registerConsulterCahierDesChargesQuery,
} from './consulter/consulterCahierDesCharges.query';

export type CahierDesChargesQueryDependencies = ConsulterCahierDesChargesDependencies;

export const registerCahierDesChargesQueries = (
  dependencies: CahierDesChargesQueryDependencies,
) => {
  registerConsulterCahierDesChargesQuery(dependencies);
};
