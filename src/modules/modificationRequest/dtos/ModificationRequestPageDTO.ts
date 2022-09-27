import { ProjectAppelOffre, Technologie, CahierDesChargesRéférence } from '@entities'
import { Fournisseur } from '../../project'
import { ModificationRequestStatusDTO } from './ModificationRequestListItemDTO'

export type ModificationRequestPageDTO = {
  id: string
  status: ModificationRequestStatusDTO

  respondedBy?: string
  respondedOn?: number
  responseFile?: {
    filename: string
    id: string
  }

  versionDate: number

  requestedOn: number
  requestedBy: string

  justification: string
  attachmentFile: {
    filename: string
    id: string
  }

  cancelledBy?: string
  cancelledOn?: number
  authority?: string

  project: {
    id: string
    numeroCRE: string
    nomProjet: string
    nomCandidat: string
    communeProjet: string
    departementProjet: string
    regionProjet: string
    puissance: number
    puissanceInitiale: number
    unitePuissance: string
    notifiedOn: number
    completionDueOn: number
    appelOffreId: string
    periodeId: string
    familleId: string | undefined
    numeroGestionnaire: string | undefined
    actionnaire: string
    potentielIdentifier: string
    technologie: Technologie
    appelOffre?: ProjectAppelOffre
    cahierDesChargesActuel: CahierDesChargesRéférence
  }
} & Variant

type Variant =
  | { type: 'actionnaire'; actionnaire: string }
  | { type: 'fournisseur'; fournisseurs: Fournisseur[]; evaluationCarbone?: number }
  | { type: 'producteur'; producteur: string }
  | { type: 'puissance'; puissance: number; puissanceAuMomentDuDepot?: number }
  | { type: 'recours' }
  | { type: 'abandon' }
  | ({
      type: 'delai'
      acceptanceParams?: { delayInMonths: number; dateAchèvementAccordée?: string }
    } & (
      | { delayInMonths: number; dateAchèvementDemandée?: undefined }
      | {
          delayInMonths?: undefined
          dateAchèvementDemandée: string
        }
    ))

export type DemandeAbandonPageDTO = ModificationRequestPageDTO & { type: 'abandon' }
