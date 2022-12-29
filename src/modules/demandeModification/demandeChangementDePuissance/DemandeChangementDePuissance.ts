import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain'
import { ok, Result } from '@core/utils'
import { ChangementDePuissanceDemandé, RejetChangementDePuissanceAnnulé } from './events'

import { ModificationReceived } from '@modules/modificationRequest'
import { EntityNotFoundError } from '../../shared'

export type StatutDemandeChangementDePuissance =
  | 'envoyée'
  | 'annulée'
  | 'accordée'
  | 'refusée'
  | 'en-instruction'

type DemandeChangementDePuissanceArgs = {
  id: UniqueEntityID
  events?: DomainEvent[]
}

export type DemandeChangementDePuissance = EventStoreAggregate & {
  statut: StatutDemandeChangementDePuissance | undefined
  projetId: string | undefined
  puissance?: number
  puissanceAuMomentDuDepot?: number // added later, so not always present
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
      case ModificationReceived.type:
        return {
          ...agregat,
          statut: 'accordée',
          projetId: event.payload.projetId || event.payload.projectId,
        }
      case RejetChangementDePuissanceAnnulé.type:
        return { ...agregat, statut: 'envoyée' }
      default:
        return agregat
    }
  }, agregatParDefaut)

  return ok(agregat)
}
