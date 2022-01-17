import { DomainEvent, BaseDomainEvent } from '@core/domain'

export interface ImportExecutedPayload {
  importId: string
  importedBy: string
}

export class ImportExecuted extends BaseDomainEvent<ImportExecutedPayload> implements DomainEvent {
  public static type: 'ImportExecuted' = 'ImportExecuted'
  public type = ImportExecuted.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ImportExecutedPayload) {
    return payload.importId
  }
}
