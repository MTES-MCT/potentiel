import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain'
import { ok } from '@core/utils'
import {
  TâcheMiseAJourDonnéesDeRaccordementDémarrée,
  TâcheMiseAJourDonnéesDeRaccordementTerminée,
} from './events'

export type ImportDonnéesRaccordement = EventStoreAggregate & {
  état: 'en cours' | 'terminé' | undefined
  tâchesEnCours: Array<{
    type: 'maj-date-mise-en-service'
  }>
}

export const makeImportDonnéesRaccordement = (args: {
  id: UniqueEntityID
  events?: DomainEvent[]
}) => {
  const { events = [], id } = args

  const agregatParDefaut: ImportDonnéesRaccordement = {
    id,
    pendingEvents: [],
    état: undefined,
    tâchesEnCours: [],
  }

  const agregat: ImportDonnéesRaccordement = events.reduce((agregat, event) => {
    switch (event.type) {
      case TâcheMiseAJourDonnéesDeRaccordementDémarrée.type:
        return {
          ...agregat,
          tâchesEnCours: [...agregat.tâchesEnCours, { type: 'maj-date-mise-en-service' }],
          état: 'en cours',
        }
      case TâcheMiseAJourDonnéesDeRaccordementTerminée.type:
        return {
          ...agregat,
          tâchesEnCours: [
            ...agregat.tâchesEnCours.filter((t) => t.type !== 'maj-date-mise-en-service'),
          ],
          état: 'terminé',
        }
      default:
        return agregat
    }
  }, agregatParDefaut)

  return ok(agregat)
}
