import { ProjectEvent } from '..'

export type DemandeDélaiEvent = ProjectEvent & {
  type: 'DemandeDélai'
  payload: {
    autorité: 'dgec' | 'dreal'
    demandeDélaiId: string
  } & (
    | {
        dateAchèvementDemandée: string
      }
    | {
        délaiEnMoisDemandé: number
      }
  ) &
    (
      | {
          statut: 'envoyée'
          demandeur: string
        }
      | ({
          statut: 'accordée'
          accordéPar: string
        } & (
          | { délaiEnMoisAccordé: number }
          | { dateAchèvementAccordée: string; ancienneDateThéoriqueAchèvement: string }
        ))
      | {
          statut: 'annulée'
          annuléPar: string
        }
      | {
          statut: 'rejetée'
          rejetéPar: string
        }
    )
}
