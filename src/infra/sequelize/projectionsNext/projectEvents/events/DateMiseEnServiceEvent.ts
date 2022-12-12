import { ProjectEvent } from '..'

export type DateMiseEnServicePayload =
  | { statut: 'renseignée'; dateMiseEnService: Date }
  | { statut: 'non-renseignée' }

export type DateMiseEnServiceEvent = ProjectEvent & {
  type: 'DateMiseEnService'
  payload: DateMiseEnServicePayload
}
