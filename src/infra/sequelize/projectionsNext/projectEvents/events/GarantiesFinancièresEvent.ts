import { ProjectEvent } from '..'

type GarantiesFinancièresDueEventPayload = { statut: 'due'; dateLimiteDEnvoi: number }
type GarantiesFinancièresUploadedEventPayload = {
  statut: 'uploaded'
  dateConstitution: number
  dateExpiration?: number
  fichier: {
    id: string
    name: string
  }
  initiéParRole?: 'porteur-projet' | 'dreal'
  dateLimiteDEnvoi?: number
}
type GarantiesFinancièresPendingEventPayload = {
  statut: 'pending-validation'
  dateConstitution: number
  dateExpiration?: number
  fichier: {
    id: string
    name: string
  }
  initiéParRole?: 'porteur-projet' | 'dreal'
  dateLimiteDEnvoi?: number
}
type GarantiesFinancièresValidatedEventPayload = {
  statut: 'validated'
  dateConstitution: number
  dateExpiration?: number
  fichier: {
    id: string
    name: string
  }
  initiéParRole?: 'porteur-projet' | 'dreal'
  dateLimiteDEnvoi?: number
}

export type GarantiesFinancièreEventPayload =
  | GarantiesFinancièresDueEventPayload
  | GarantiesFinancièresPendingEventPayload
  | GarantiesFinancièresUploadedEventPayload
  | GarantiesFinancièresValidatedEventPayload

export type GarantiesFinancièresEvent = ProjectEvent & {
  type: 'GarantiesFinancières'
  payload: GarantiesFinancièreEventPayload
}
