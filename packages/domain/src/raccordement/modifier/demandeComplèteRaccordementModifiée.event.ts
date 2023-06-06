import { DomainEvent } from '@potentiel/core-domain';

export type DemandeComplèteRaccordementModifiéeEvent = DomainEvent<
  'DemandeComplèteRaccordementModifiée',
  {
    identifiantProjet: string;
    dateQualification: string;
    referenceActuelle: string;
    nouvelleReference: string;
  }
>;
