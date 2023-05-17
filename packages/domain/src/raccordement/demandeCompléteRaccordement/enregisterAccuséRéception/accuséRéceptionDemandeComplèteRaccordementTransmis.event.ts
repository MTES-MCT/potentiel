import { DomainEvent } from '@potentiel/core-domain';

export type AccuséRéceptionDemandeComplèteRaccordementTransmisEvent = DomainEvent<
  'AccuséRéceptionDemandeComplèteRaccordementTransmis',
  {
    identifiantProjet: string;
    format: string;
    référence: string;
  }
>;
