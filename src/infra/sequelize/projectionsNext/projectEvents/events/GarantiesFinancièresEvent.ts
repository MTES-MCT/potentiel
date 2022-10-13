import { ProjectEvent } from '..'

export type GarantiesFinancièresEvent = ProjectEvent & {
  type: 'GarantiesFinancières'
  payload: {
    type: 'GarantiesFinancières'
    dateExpiration?: number
    initiéParRole?: 'porteur-projet' | 'dreal'
  } & (
    | { statut: 'due'; dateLimiteDEnvoi: number }
    | {
        statut: 'uploaded' | 'pending-validation' | 'validated'
        dateConstitution: number
        fichier: {
          id: string
          name: string
        }
      }
  )
}
