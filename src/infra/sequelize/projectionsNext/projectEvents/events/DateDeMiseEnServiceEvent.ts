import { ProjectEvent } from '..'

export type DateDeMiseEnServiceEvent = ProjectEvent & {
  type: 'DateDeMiseEnServiceAjoutée'
  payload: { nouvelleDateDeMiseEnService: string }
}
