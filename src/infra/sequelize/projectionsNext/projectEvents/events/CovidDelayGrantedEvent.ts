import { ProjectEvent } from '..'

export type CovidDelayGrantedEvent = ProjectEvent & {
  type: 'CovidDelayGranted'
  payload: null
}
