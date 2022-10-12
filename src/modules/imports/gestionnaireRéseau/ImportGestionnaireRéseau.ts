import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain'
import { ok } from '@core/utils'
import { ImportGestionnaireRéseauDémarré } from './events'

export type ImportGestionnaireRéseau = EventStoreAggregate & { état: 'en cours' | undefined }

export const makeImportGestionnaireRéseau = (args: {
  id: UniqueEntityID
  events?: DomainEvent[]
}) => {
  const { events = [], id } = args

  const agregatParDefaut: ImportGestionnaireRéseau = {
    id,
    pendingEvents: [],
    état: undefined,
  }

  const agregat: ImportGestionnaireRéseau = events.reduce((agregat, event) => {
    switch (event.type) {
      case ImportGestionnaireRéseauDémarré.type:
        return {
          ...agregat,
          état: 'en cours',
        }
      default:
        return agregat
    }
  }, agregatParDefaut)

  return ok(agregat)
}
