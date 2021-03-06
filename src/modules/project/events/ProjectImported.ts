import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectImportedPayload {
  projectId: string
  periodeId: string
  appelOffreId: string
  familleId: string
  numeroCRE: string
  importedBy: string
  data: {
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
export class ProjectImported
  extends BaseDomainEvent<ProjectImportedPayload>
  implements DomainEvent {
  public static type: 'ProjectImported' = 'ProjectImported'
  public type = ProjectImported.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectImportedPayload) {
    return payload.projectId
  }
}
