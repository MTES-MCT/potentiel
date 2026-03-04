import { Lauréat, RécupererGRDParVillePort } from '@potentiel-domain/projet';
import { Unsubscribe } from '@potentiel-infrastructure/pg-event-sourcing';

export type SetupProjetDependencies = {
  récupérerGRDParVille: RécupererGRDParVillePort;
  récupererConstitutionGarantiesFinancières: Lauréat.GarantiesFinancières.RécupererConstitutionGarantiesFinancièresPort;
};

export type SetupProjet = (dependencies: SetupProjetDependencies) => Promise<Unsubscribe>;
