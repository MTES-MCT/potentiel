import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain'
import { ok } from '@core/utils'
import {
  TâcheMiseAJourDatesMiseEnServiceDémarrée,
  TâcheMiseAJourDatesMiseEnServiceTerminée,
} from './events'

export type ImportGestionnaireRéseau = EventStoreAggregate & {
  dateDeDébut: number
  état: 'en cours' | 'terminé' | undefined
  tâchesEnCours: Array<{
    type: 'maj-date-mise-en-service'
  }>
}

export const makeImportGestionnaireRéseau = (args: {
  id: UniqueEntityID
  events?: DomainEvent[]
}) => {
  const { events = [], id } = args

  const agregatParDefaut: ImportGestionnaireRéseau = {
    id,
    pendingEvents: [],
    dateDeDébut: undefined!,
    état: undefined,
    tâchesEnCours: [],
  }

  const agregat: ImportGestionnaireRéseau = events.reduce((agregat, event) => {
    switch (event.type) {
      case TâcheMiseAJourDatesMiseEnServiceDémarrée.type:
        return {
          ...agregat,
          dateDeDébut: event.occurredAt.getTime(),
          tâchesEnCours: [...agregat.tâchesEnCours, { type: 'maj-date-mise-en-service' }],
          état: 'en cours',
        }
      case TâcheMiseAJourDatesMiseEnServiceTerminée.type:
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
