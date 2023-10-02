import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '@potentiel/domain';

export type QuelqueChoseSestPasséEvent = DomainEvent<
  'QuelqueChoseSestPassé',
  {
    identifiantProjet: RawIdentifiantProjet;
  }
>;
