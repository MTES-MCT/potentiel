import { BaseDomainEvent, DomainEvent } from '../../../core/domain';

import { Actionnariat } from '../types';

export interface ProjectRawDataCorrectedPayload {
  projectId: string;
  correctedBy: string;
  correctedData: {
    nomProjet: string;
    territoireProjet: string;
    puissance: number;
    prixReference: number;
    evaluationCarbone: number;
    note: number;
    nomCandidat: string;
    nomRepresentantLegal: string;
    email: string;
    adresseProjet: string;
    codePostalProjet: string;
    communeProjet: string;
    engagementFournitureDePuissanceAlaPointe: boolean;
    isFinancementParticipatif: boolean;
    isInvestissementParticipatif: boolean;
    motifsElimination: string;
    actionnariat?: Actionnariat;
  };
}

// This exists only to access Project repo from within the ssr=>legacy saga.
export class ProjectRawDataCorrected
  extends BaseDomainEvent<ProjectRawDataCorrectedPayload>
  implements DomainEvent
{
  public static type: 'ProjectRawDataCorrected' = 'ProjectRawDataCorrected';
  public type = ProjectRawDataCorrected.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: ProjectRawDataCorrectedPayload) {
    return payload.projectId;
  }
}