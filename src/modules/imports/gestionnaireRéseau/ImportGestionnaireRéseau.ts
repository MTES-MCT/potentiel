import { EventStoreAggregate } from '@core/domain'

export type ImportGestionnaireRéseau = EventStoreAggregate & { état: 'en cours' | undefined }
