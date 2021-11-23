import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectDataCorrectedPayload {
  projectId: string
  correctedBy: string
  correctedData: Partial<{
    nomProjet: string
    territoireProjet: string
    puissance: number
    prixReference: number
    evaluationCarbone: number
    note: number
    nomCandidat: string
    nomRepresentantLegal: string
    email: string
    adresseProjet: string
    codePostalProjet: string
    communeProjet: string
    engagementFournitureDePuissanceAlaPointe: boolean
    isFinancementParticipatif: boolean
    isInvestissementParticipatif: boolean
    motifsElimination: string
  }>
}
export class ProjectDataCorrected
  extends BaseDomainEvent<ProjectDataCorrectedPayload>
  implements DomainEvent {
  public static type: 'ProjectDataCorrected' = 'ProjectDataCorrected'
  public type = ProjectDataCorrected.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectDataCorrectedPayload) {
    return payload.projectId
  }
}
