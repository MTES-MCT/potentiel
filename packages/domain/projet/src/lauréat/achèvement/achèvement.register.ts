import {
  ConsulterAttestationConformitéDependencies,
  registerConsulterAttestationConformitéQuery,
} from './consulter/consulterAttestationConformité.query';

export type AchèvementQueryDependencies = ConsulterAttestationConformitéDependencies;

export const registerAchèvementQueries = (dependencies: AchèvementQueryDependencies) => {
  registerConsulterAttestationConformitéQuery(dependencies);
};
