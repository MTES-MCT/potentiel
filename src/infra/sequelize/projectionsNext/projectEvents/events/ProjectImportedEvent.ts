import { ProjectEvent } from '..'

export type ProjectImportedEvent = ProjectEvent & {
  type: 'ProjectImported'
  payload: { notifiedOn: number }
}
