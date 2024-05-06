import {
  AbandonCommandDependencies,
  AbandonQueryDependencies,
  registerAbandonQueries,
  registerAbandonUseCases,
} from './abandon/abandon.register';
import {
  AttestationConformitéCommandDependencies,
  AttestationConformitéQueryDependencies,
  registerAttestationConformitéQueries,
  registerAttestationConformitéUseCases,
} from './achèvement/attestationConformité/attestationConformité.register';
import {
  CahierDesChargesChoisiQueryDependencies,
  registerCahierDesChargesChoisiQueries,
} from './cahierDesChargesChoisi/cahierDesChargesChoisi.register';
import {
  GarantiesFinancièresCommandDependencies,
  GarantiesFinancièresQueryDependencies,
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garantiesFinancières/garantiesFinancières.register';

export type LauréatQueryDependencies = AbandonQueryDependencies &
  CahierDesChargesChoisiQueryDependencies &
  GarantiesFinancièresQueryDependencies &
  AttestationConformitéQueryDependencies;
export type LauréatCommandDependencies = AbandonCommandDependencies &
  GarantiesFinancièresCommandDependencies &
  AttestationConformitéCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerAbandonUseCases(dependencies);
  registerGarantiesFinancièresUseCases(dependencies);
  registerAttestationConformitéUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerAbandonQueries(dependencies);
  registerCahierDesChargesChoisiQueries(dependencies);
  registerGarantiesFinancièresQueries(dependencies);
  registerAttestationConformitéQueries(dependencies);
};
