import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain'
import { ok, Result } from '@core/utils'
import { ChangementDePuissanceDemandé } from './events'

import { ModificationRequested } from '@modules/modificationRequest'
import { EntityNotFoundError } from '../../shared'

export type StatutDemandeDélai = 'envoyée' | 'annulée' | 'accordée' | 'refusée' | 'en-instruction'

type DemandeChangementDePuissanceArgs = {
  id: UniqueEntityID
  events?: DomainEvent[]
}

export type DemandeChangementDePuissance = EventStoreAggregate & {
  statut: StatutDemandeDélai | undefined
  projetId: string | undefined
}

export const makeDemandeChangementDePuissance = (
  args: DemandeChangementDePuissanceArgs
): Result<DemandeChangementDePuissance, EntityNotFoundError> => {
  const { events = [], id } = args

  const agregatParDefaut: DemandeChangementDePuissance = {
    projetId: undefined,
    statut: undefined,
    id,
    pendingEvents: [],
  }

  const agregat: DemandeChangementDePuissance = events.reduce((agregat, event) => {
    switch (event.type) {
      case ChangementDePuissanceDemandé.type:
      case ModificationRequested.type:
        return {
          ...agregat,
          statut: 'envoyée',
          projetId: event.payload.projetId || event.payload.projectId,
        }
      default:
        return agregat
    }
  }, agregatParDefaut)

  return ok(agregat)
}
