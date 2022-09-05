import { ProjectEvent } from '..'

type PayloadDemandeDélaiEnMoisEvent = {
  dateAchèvementDemandée?: undefined
  délaiEnMoisDemandé: number
} & (
  | {
      statut: 'envoyée'
      demandeur: string
    }
  | {
      statut: 'accordée'
      accordéPar: string
      délaiEnMoisAccordé: number
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
type PayloadDemandeDélaiAvecDateEvent = {
  dateAchèvementDemandée: string
  délaiEnMoisDemandé?: undefined
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

export type DemandeDélaiEvent = ProjectEvent & {
  type: 'DemandeDélai'
  payload: {
    autorité: 'dgec' | 'dreal'
    demandeDélaiId: string
  } & (PayloadDemandeDélaiAvecDateEvent | PayloadDemandeDélaiEnMoisEvent)
}
