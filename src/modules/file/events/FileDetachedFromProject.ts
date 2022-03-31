import { DomainEvent, BaseDomainEvent } from '@core/domain'

export interface FileDetachedFromProjectPayload {
  attachmentId: string
  detachedBy: string
}

export class FileDetachedFromProject
  extends BaseDomainEvent<FileDetachedFromProjectPayload>
  implements DomainEvent
{
  public static type: 'FileDetachedFromProject' = 'FileDetachedFromProject'
  public type = FileDetachedFromProject.type
  currentVersion = 1

  aggregateIdFromPayload(payload: FileDetachedFromProjectPayload) {
    return undefined
  }
}
