import {
  AttestationConformitéCommandDependencies,
  AttestationConformitéQueryDependencies,
  registerAttestationConformitéQueries,
  registerAttestationConformitéUseCases,
} from './attestationConformité/attestationConformité.register';
import {
  ConsulterAchèvementDependencies,
  registerConsulterAchèvementQuery,
} from './consulter/consulterAchèvement.query';

export type AchèvementCommandDependencies = AttestationConformitéCommandDependencies;

export const registerAchèvementUseCases = (dependencies: AchèvementCommandDependencies) => {
  registerAttestationConformitéUseCases(dependencies);
};

export type AchèvementQueryDependencies = AttestationConformitéQueryDependencies &
  ConsulterAchèvementDependencies;

export const registerAchèvementQueries = (dependencies: AchèvementQueryDependencies) => {
  registerAttestationConformitéQueries(dependencies);
  registerConsulterAchèvementQuery(dependencies);
};
