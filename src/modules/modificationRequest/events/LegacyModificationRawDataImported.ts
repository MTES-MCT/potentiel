import { LegacyModificationDTO } from '../dtos'
import { DomainEvent, BaseDomainEvent } from '@core/domain'

export interface LegacyModificationRawDataImportedPayload {
  periodeId: string
  appelOffreId: string
  familleId: string
  numeroCRE: string
  importId: string
  modifications: LegacyModificationDTO[]
}

export class LegacyModificationRawDataImported
  extends BaseDomainEvent<LegacyModificationRawDataImportedPayload>
  implements DomainEvent
{
  public static type: 'LegacyModificationRawDataImported' = 'LegacyModificationRawDataImported'
  public type = LegacyModificationRawDataImported.type
  currentVersion = 1

  aggregateIdFromPayload(payload: LegacyModificationRawDataImportedPayload) {
    return payload.importId
  }
}
