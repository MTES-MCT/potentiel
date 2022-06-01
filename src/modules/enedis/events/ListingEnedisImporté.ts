import { DomainEvent, BaseDomainEvent } from '@core/domain'

export interface ListingEnedisImportéPayload {
  fileId: string
  uploadedBy: string
}

export class ListingEnedisImporté
  extends BaseDomainEvent<ListingEnedisImportéPayload>
  implements DomainEvent
{
  public static type: 'ListingEnedisImporté' = 'ListingEnedisImporté'
  public type = ListingEnedisImporté.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ListingEnedisImportéPayload) {
    return undefined
  }
}
