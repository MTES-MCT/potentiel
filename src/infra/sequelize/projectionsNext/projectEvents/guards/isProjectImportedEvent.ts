import { ProjectEvent } from '..'

type ProjectImportedEvent = ProjectEvent & {
  type: 'ProjectImported'
  payload: { notifiedOn: number }
}

export const isProjectImportedEvent = (
  projectEvent: ProjectEvent
): projectEvent is ProjectImportedEvent =>
  projectEvent.type === 'ProjectImported' && typeof projectEvent.payload?.notifiedOn === 'string'
