import { ProjectEvent } from '..'

export type FileAttachedToProjectEvent = ProjectEvent & {
  type: 'FileAttachedToProject'
  payload: {
    title: string
    description: string
    files: Array<{ id: string; name: string }>
    attachedBy: {
      id: string
      name?: string
      administration?: string
    }
    attachmentId: string
  }
}
