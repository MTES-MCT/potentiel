import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain'
import { ok, Result } from '@core/utils'
import {
  DélaiAccordé,
  DélaiAnnulé,
  DélaiDemandé,
  DélaiEnInstruction,
  DélaiRejeté,
  RejetDemandeDélaiAnnulé,
} from './events'

import {
  ModificationRequestAccepted,
  ModificationRequestCancelled,
  ModificationRequested,
  ModificationRequestInstructionStarted,
  ModificationRequestRejected,
} from '@modules/modificationRequest'
import { EntityNotFoundError } from '../../shared'
import { AccordDemandeDélaiAnnulé } from './events/AccordDemandeDélaiAnnulé'

export type StatutDemandeDélai = 'envoyée' | 'annulée' | 'accordée' | 'refusée' | 'en-instruction'

type DemandeDélaiArgs = {
  id: UniqueEntityID
  events?: DomainEvent[]
}

export type DemandeDélai = EventStoreAggregate & {
  statut: StatutDemandeDélai | undefined
  projetId: string | undefined
  ancienneDateThéoriqueAchèvement: string | undefined
  dateAchèvementAccordée: string | undefined
  délaiEnMoisAccordé: number | undefined
}

export const makeDemandeDélai = (
  args: DemandeDélaiArgs
): Result<DemandeDélai, EntityNotFoundError> => {
  const { events = [], id } = args

  const agregatParDefaut: DemandeDélai = {
    projetId: undefined,
    statut: undefined,
    id,
    pendingEvents: [],
    ancienneDateThéoriqueAchèvement: undefined,
    dateAchèvementAccordée: undefined,
    délaiEnMoisAccordé: undefined,
  }

  const agregat: DemandeDélai = events.reduce((agregat, event) => {
    switch (event.type) {
      case DélaiDemandé.type:
      case ModificationRequested.type:
        return {
          ...agregat,
          statut: 'envoyée',
          projetId: event.payload.projetId || event.payload.projectId,
        }
      case DélaiAccordé.type:
        const { ancienneDateThéoriqueAchèvement, dateAchèvementAccordée } = event.payload
        return {
          ...agregat,
          statut: 'accordée',
          ancienneDateThéoriqueAchèvement,
          dateAchèvementAccordée,
        }
      case ModificationRequestAccepted.type:
        return {
          ...agregat,
          statut: 'accordée',
          délaiEnMoisAccordé: event.payload.acceptanceParams.delayOnMonths,
        }
      case DélaiAnnulé.type:
      case ModificationRequestCancelled.type:
        return { ...agregat, statut: 'annulée' }
      case DélaiRejeté.type:
      case ModificationRequestRejected.type:
        return { ...agregat, statut: 'refusée' }
      case DélaiEnInstruction.type:
      case ModificationRequestInstructionStarted.type:
      case RejetDemandeDélaiAnnulé.type:
        return { ...agregat, statut: 'en-instruction' }

      case RejetDemandeDélaiAnnulé.type:
      case AccordDemandeDélaiAnnulé.type:
        return { ...agregat, statut: 'envoyée' }
      default:
        return agregat
    }
  }, agregatParDefaut)

  return ok(agregat)
}
