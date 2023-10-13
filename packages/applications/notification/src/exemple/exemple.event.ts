import { DomainEvent } from '@potentiel-domain/core';
import { RawIdentifiantProjet } from '@potentiel/domain-usecases';

export type QuelqueChoseSestPasséEvent = DomainEvent<
  'QuelqueChoseSestPassé',
  {
    identifiantProjet: RawIdentifiantProjet;
  }
>;
