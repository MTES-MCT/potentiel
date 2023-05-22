import { DomainEvent } from '@potentiel/core-domain';

export type AccuséRéceptionDemandeComplèteRaccordementSuppriméEvent = DomainEvent<
  'AccuséRéceptionDemandeComplèteRaccordementSupprimé',
  {
    identifiantProjet: string;
    format: string;
    référenceDossierRaccordement: string;
  }
>;
