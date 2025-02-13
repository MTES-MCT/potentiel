import { DomainEvent, BaseDomainEvent } from '../../../core/domain';
import { Actionnariat } from '../types';

export interface ProjectDataCorrectedPayload {
  projectId: string;
  correctedBy: string;
  correctedData: Partial<{
    nomProjet: string;
    territoireProjet: string;
    puissance: number;
    puissanceInitiale: number;
    prixReference: number;
    evaluationCarbone: number;
    note: number;
    nomCandidat: string;
    nomRepresentantLegal: string;
    email: string;
    adresseProjet: string;
    codePostalProjet: string;
    regionProjet: string;
    departementProjet: string;
    communeProjet: string;
    engagementFournitureDePuissanceAlaPointe: boolean;
    isFinancementParticipatif: boolean;
    isInvestissementParticipatif: boolean;
    motifsElimination: string;
    actionnaire: string;
    actionnariat?: Actionnariat;
  }>;
}
export class ProjectDataCorrected
  extends BaseDomainEvent<ProjectDataCorrectedPayload>
  implements DomainEvent
{
  public static type: 'ProjectDataCorrected' = 'ProjectDataCorrected';
  public type = ProjectDataCorrected.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: ProjectDataCorrectedPayload) {
    return payload.projectId;
  }
}
