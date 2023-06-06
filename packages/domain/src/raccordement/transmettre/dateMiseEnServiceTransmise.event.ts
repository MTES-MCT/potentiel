import { DomainEvent } from '@potentiel/core-domain';

export type DateMiseEnServiceTransmiseEvent = DomainEvent<
  'DateMiseEnServiceTransmise',
  {
    dateMiseEnService: string;
    référenceDossierRaccordement: string;
    identifiantProjet: string;
  }
>;
