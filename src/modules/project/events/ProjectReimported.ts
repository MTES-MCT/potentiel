import { DomainEvent, BaseDomainEvent } from '@core/domain'

export interface ProjectReimportedPayload {
  projectId: string
  periodeId: string
  appelOffreId: string
  familleId?: string
  importId: string // This field was added later
  data: Partial<{
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
    actionnaire: string
    classe: string
    motifsElimination: string
    notifiedOn: number
    details: any
  }>
}
export class ProjectReimported
  extends BaseDomainEvent<ProjectReimportedPayload>
  implements DomainEvent {
  public static type: 'ProjectReimported' = 'ProjectReimported'
  public type = ProjectReimported.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectReimportedPayload) {
    return payload.projectId
  }
}
