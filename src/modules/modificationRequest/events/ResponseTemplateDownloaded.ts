import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ResponseTemplateDownloadedPayload {
  modificationRequestId: string
  downloadedBy: string
}
export class ResponseTemplateDownloaded
  extends BaseDomainEvent<ResponseTemplateDownloadedPayload>
  implements DomainEvent {
  public static type: 'ResponseTemplateDownloaded' = 'ResponseTemplateDownloaded'
  public type = ResponseTemplateDownloaded.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ResponseTemplateDownloadedPayload) {
    // This event does not mutate an agregate
    return undefined
  }
}
