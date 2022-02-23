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
  }
} & Variant

type Variant =
  | { type: 'actionnaire'; actionnaire: string }
  | { type: 'fournisseur'; fournisseurs: Fournisseur[]; evaluationCarbone?: number }
  | { type: 'producteur'; producteur: string }
  | ({
      type: 'puissance'
      puissance: number
    } & (
      | {
          isAuto: true
        }
      | {
          isAuto: false
          reason: 'hors-ratios-autorisés' | 'puissance-max-volume-reseve-depassée'
        }
    ))
  | { type: 'recours' }
  | { type: 'abandon' }
  | { type: 'delai'; delayInMonths: number; acceptanceParams?: { delayInMonths: number } }
