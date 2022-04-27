import { DomainEvent, BaseDomainEvent } from '@core/domain'

export interface EDFFileUploadedPayload {
  fileId: string
  uploadedBy: string
}

export class EDFFileUploaded
  extends BaseDomainEvent<EDFFileUploadedPayload>
  implements DomainEvent
{
  public static type: 'EDFFileUploaded' = 'EDFFileUploaded'
  public type = EDFFileUploaded.type
  currentVersion = 1

  aggregateIdFromPayload(payload: EDFFileUploadedPayload) {
    return undefined
  }
}
