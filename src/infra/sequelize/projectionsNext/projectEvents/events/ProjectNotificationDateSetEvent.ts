import { ProjectEvent } from '..'

export type ProjectNotificationDateSetEvent = ProjectEvent & {
  type: 'ProjectNotificationDateSet'
  payload: null
}
