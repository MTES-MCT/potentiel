import { Project } from '../../../entities'
import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectDataCorrectedPayload {
  projectId: Project['id']
  certificateFileId?: Project['certificateFileId']
  notifiedOn: Project['notifiedOn']
  correctedData: Partial<{
    numeroCRE: string
    appelOffreId: string
    periodeId: string
    familleId: string
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
    isClasse: boolean
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
