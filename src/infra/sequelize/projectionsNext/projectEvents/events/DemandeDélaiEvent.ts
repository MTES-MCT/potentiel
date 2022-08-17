import { ProjectEvent } from '..'

export type DemandeDélaiEvent = ProjectEvent & {
  type: 'DemandeDélai'
  payload: {
    autorité: 'dgec' | 'dreal'
    demandeDélaiId: string
    dateAchèvementDemandée: string
  } & (
    | {
        statut: 'envoyée'
        demandeur: string
      }
    | {
        statut: 'accordée'
        accordéPar: string
        dateAchèvementAccordée: string
        ancienneDateThéoriqueAchèvement: string
      }
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
