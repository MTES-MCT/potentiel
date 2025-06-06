import { DomainEvent, BaseDomainEvent } from '../../../core/domain';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DésignationCatégorie, HistoriqueAbandon } from '../types';
import { Candidature } from '@potentiel-domain/projet';

export interface ProjectImportedPayload {
  projectId: string;
  appelOffreId: string;
  periodeId: string;
  familleId: string;
  numeroCRE: string;
  potentielIdentifier: string;
  importId: string; // added later
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
    soumisAuxGF?: true;
    désignationCatégorie?: DésignationCatégorie;
    historiqueAbandon?: HistoriqueAbandon;
  };
}
export class ProjectImported
  extends BaseDomainEvent<ProjectImportedPayload>
  implements DomainEvent
{
  public static type: 'ProjectImported' = 'ProjectImported';
  public type = ProjectImported.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: ProjectImportedPayload) {
    return payload.projectId;
  }
}
