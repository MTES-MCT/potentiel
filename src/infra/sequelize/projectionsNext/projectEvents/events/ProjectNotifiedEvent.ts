import { ProjectEvent } from '..'

export type ProjectNotifiedEvent = ProjectEvent & {
  type: 'ProjectNotified'
  payload: null
}
