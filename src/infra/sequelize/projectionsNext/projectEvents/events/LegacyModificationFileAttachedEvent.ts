import { ProjectEvent } from '..'

export type LegacyModificationFileAttachedEvent = ProjectEvent & {
  type: 'LegacyModificationFileAttached'
  payload: { fileId: string; filename: string }
}
