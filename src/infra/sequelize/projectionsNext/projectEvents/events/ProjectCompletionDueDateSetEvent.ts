import { ProjectEvent } from '..'

export type ProjectCompletionDueDateSetEvent = ProjectEvent & {
  type: 'ProjectCompletionDueDateSet'
  payload: null
}
