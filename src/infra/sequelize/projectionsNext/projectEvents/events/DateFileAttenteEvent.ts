import { ProjectEvent } from '..'

export type DateFileAttenteEvent = ProjectEvent & {
  type: 'DateFileAttente'
  payload: { dateFileAttente: string }
}
