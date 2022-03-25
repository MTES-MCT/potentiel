import { DomainEvent, BaseDomainEvent } from '@core/domain'

type AttachedFile = {
  id: string
  name: string
}

export interface FileAttachedToProjectPayload {
  projectId: string
  attachmentId: string
  title: string
  description?: string
  files: AttachedFile[]
  attachedBy: string
  date: number
}

export class FileAttachedToProject
  extends BaseDomainEvent<FileAttachedToProjectPayload>
  implements DomainEvent
{
  public static type: 'FileAttachedToProject' = 'FileAttachedToProject'
  public type = FileAttachedToProject.type
  currentVersion = 1

  aggregateIdFromPayload(payload: FileAttachedToProjectPayload) {
    return payload.attachmentId
  }
}
