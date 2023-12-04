import {
  ConsulterCahierDesChargesChoisiDependencies,
  registerConsulterCahierDesChargesChoisiQuery,
} from './consulter/consulterCahierDesChargesChoisi.query';

export type CahierDesChargesChoisiQueryDependencies = ConsulterCahierDesChargesChoisiDependencies;

export const registerCahierDesChargesChoisiQueries = (
  dependencies: CahierDesChargesChoisiQueryDependencies,
) => {
  registerConsulterCahierDesChargesChoisiQuery(dependencies);
};
