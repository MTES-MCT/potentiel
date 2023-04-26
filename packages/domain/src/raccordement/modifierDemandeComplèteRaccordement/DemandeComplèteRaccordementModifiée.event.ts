import { DomainEvent } from '@potentiel/core-domain';

export type DemandeComplèteRaccordementModifiéeEvent = DomainEvent<
  'DemandeComplèteRaccordementModifiée',
  {
    identifiantProjet: string;
    dateQualification: string;
    référenceDossierRaccordement: string;
  }
>;
