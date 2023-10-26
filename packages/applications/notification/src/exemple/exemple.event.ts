import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DomainEvent } from '@potentiel-domain/core';
import { RawIdentifiantProjet } from '@potentiel/domain-usecases';

export type QuelqueChoseSestPasséEvent = Event &
  DomainEvent<
    'QuelqueChoseSestPassé',
    {
      identifiantProjet: RawIdentifiantProjet;
    }
  >;
