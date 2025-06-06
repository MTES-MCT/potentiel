import { BaseDomainEvent, DomainEvent } from '../../../core/domain';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DésignationCatégorie, HistoriqueAbandon } from '../types';
import { Candidature } from '@potentiel-domain/projet';

export interface ProjectRawDataImportedPayload {
  importId: string;
  data: {
    periodeId: string;
    appelOffreId: string;
    familleId: string;
    territoireProjet: string;
    numeroCRE: string;
    nomCandidat: string;
    actionnaire: string;
    nomProjet: string;
    puissance: number;
    prixReference: number;
    evaluationCarbone: number;
    note: number;
    nomRepresentantLegal: string;
    isFinancementParticipatif: boolean;
    isInvestissementParticipatif: boolean;
    engagementFournitureDePuissanceAlaPointe: boolean;
    email: string;
    adresseProjet: string;
    codePostalProjet: string;
    communeProjet: string;
    departementProjet: string;
    regionProjet: string;
    classe: string;
    motifsElimination: string;
    notifiedOn: number;
    details: any;
    technologie: Candidature.TypeTechnologie.RawType;
    actionnariat?: string;
    garantiesFinancièresType?: string;
    garantiesFinancièresDateEchéance?: string;
    désignationCatégorie?: DésignationCatégorie;
    historiqueAbandon?: HistoriqueAbandon;
  };
}
export class ProjectRawDataImported
  extends BaseDomainEvent<ProjectRawDataImportedPayload>
  implements DomainEvent
{
  public static type: 'ProjectRawDataImported' = 'ProjectRawDataImported';
  public type = ProjectRawDataImported.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: ProjectRawDataImportedPayload) {
    return payload.importId;
  }
}
