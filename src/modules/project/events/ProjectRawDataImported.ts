import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface ProjectRawDataImportedPayload {
  importId: string
  data: {
    periodeId: string
    appelOffreId: string
    familleId: string
    territoireProjet: string
    numeroCRE: string
    nomCandidat: string
    actionnaire: string
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
    classe: string
    motifsElimination: string
    notifiedOn: number
    details: any
    technologie?: string
  }
}
export class ProjectRawDataImported
  extends BaseDomainEvent<ProjectRawDataImportedPayload>
  implements DomainEvent
{
  public static type: 'ProjectRawDataImported' = 'ProjectRawDataImported'
  public type = ProjectRawDataImported.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectRawDataImportedPayload) {
    return payload.importId
  }
}
