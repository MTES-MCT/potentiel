import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain'
import { ok } from '@core/utils'
import { MiseAJourDateMiseEnServiceDémarrée, MiseAJourDateMiseEnServiceTerminée } from './events'

export type ImportGestionnaireRéseau = EventStoreAggregate & {
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
    état: undefined,
    tâchesEnCours: [],
  }

  const agregat: ImportGestionnaireRéseau = events.reduce((agregat, event) => {
    switch (event.type) {
      case MiseAJourDateMiseEnServiceDémarrée.type:
        return {
          ...agregat,
          tâchesEnCours: [...agregat.tâchesEnCours, { type: 'maj-date-mise-en-service' }],
          état: 'en cours',
        }
      case MiseAJourDateMiseEnServiceTerminée.type:
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
