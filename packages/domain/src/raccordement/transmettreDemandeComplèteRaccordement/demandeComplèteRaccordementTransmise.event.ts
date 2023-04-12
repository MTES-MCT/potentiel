import { DomainEvent } from '@potentiel/core-domain';

export type DemandeComplèteRaccordementTransmiseEvent = DomainEvent<
  'DemandeComplèteDeRaccordementTransmise',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
    dateQualification: string;
    référenceDossierRaccordement: string;
  }
>;
