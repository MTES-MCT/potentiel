import { DomainEvent, BaseDomainEvent } from '@core/domain'

export interface ListingEDFImportéPayload {
  fileId: string
  uploadedBy: string
}

export class ListingEDFImporté
  extends BaseDomainEvent<ListingEDFImportéPayload>
  implements DomainEvent
{
  public static type: 'ListingEDFImporté' = 'ListingEDFImporté'
  public type = ListingEDFImporté.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ListingEDFImportéPayload) {
    return undefined
  }
}
