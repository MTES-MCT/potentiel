import {
  AttestationConformitéCommandDependencies,
  AttestationConformitéQueryDependencies,
  registerAttestationConformitéQueries,
  registerAttestationConformitéUseCases,
} from './attestationConformité/attestationConformité.register';

export type AchèvementCommandDependencies = AttestationConformitéCommandDependencies;

export const registerAchèvementUseCases = (dependencies: AchèvementCommandDependencies) => {
  registerAttestationConformitéUseCases(dependencies);
};

export type AchèvementQueryDependencies = AttestationConformitéQueryDependencies;

export const registerAchèvementQueries = (dependencies: AchèvementQueryDependencies) => {
  registerAttestationConformitéQueries(dependencies);
};
