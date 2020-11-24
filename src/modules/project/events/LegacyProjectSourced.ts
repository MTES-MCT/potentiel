import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

//
// This event is a value dump for items that were in the projects database table before the switch to event sourcing
//

export interface LegacyProjectSourcedPayload {
  projectId: string
  numeroCRE: string
  periodeId: string
  appelOffreId: string
  familleId: string
  content: {
    periodeId: string
    appelOffreId: string
    familleId: string
    territoireProjet: string
    numeroCRE: string
    nomCandidat: string
    nomProjet: string
    puissance: number
    prixReference: number
    evaluationCarbone: number
    note: number
    nomRepresentantLegal: string
    isFinancementParticipatif: boolean
    isInvestissementParticipatif: boolean
    engagementFournitureDePuissanceAlaPointe: boolean
    email: string
    adresseProjet: string
    codePostalProjet: string
    communeProjet: string
    departementProjet: string
    regionProjet: string
    fournisseur: string
    actionnaire: string
    classe: string
    motifsElimination: string
    notifiedOn: number
    details: any
  }
}
export class LegacyProjectSourced
  extends BaseDomainEvent<LegacyProjectSourcedPayload>
  implements DomainEvent {
  public static type: 'LegacyProjectSourced' = 'LegacyProjectSourced'
  public type = LegacyProjectSourced.type
  currentVersion = 1

  aggregateIdFromPayload(payload: LegacyProjectSourcedPayload) {
    return payload.projectId
  }
}
