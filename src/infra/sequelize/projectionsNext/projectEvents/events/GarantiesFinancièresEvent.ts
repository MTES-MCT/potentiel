import { ProjectEvent } from '..'

export type GarantiesFinancièresDueEventPayload = { statut: 'due'; dateLimiteDEnvoi: number }
export type GarantiesFinancièresUploadedEventPayload = {
  statut: 'uploaded' | 'pending-validation' | 'validated'
  dateConstitution: number
  dateExpiration: number
  fichier: {
    id: string
    name: string
  }
  initiéParRole?: 'porteur-projet' | 'dreal'
}
export type GarantiesFinancièresPendingEventPayload = {
  statut: 'uploaded' | 'pending-validation' | 'validated'
  dateConstitution: number
  dateExpiration: number
  fichier: {
    id: string
    name: string
  }
  initiéParRole?: 'porteur-projet' | 'dreal'
}
export type GarantiesFinancièresValidatedEventPayload = {
  statut: 'uploaded' | 'pending-validation' | 'validated'
  dateConstitution: number
  dateExpiration: number
  fichier: {
    id: string
    name: string
  }
  initiéParRole?: 'porteur-projet' | 'dreal'
}

export type GarantiesFinancièresEvent = ProjectEvent & {
  type: 'GarantiesFinancières'
  payload:
    | GarantiesFinancièresDueEventPayload
    | GarantiesFinancièresPendingEventPayload
    | GarantiesFinancièresUploadedEventPayload
    | GarantiesFinancièresValidatedEventPayload
}
