import { ResultAsync } from '@core/utils';
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared';
import { ProjectAppelOffre, CahierDesChargesRéférence } from '@entities';

export type ProjectDataForChoisirCDCPage = {
  id: string;
  appelOffre: ProjectAppelOffre;
  cahierDesChargesActuel: CahierDesChargesRéférence;
  identifiantGestionnaireRéseau?: string;
  gestionnaireRéseau?: { codeEIC: string; raisonSociale: string };
  listeGestionnairesRéseau?: {
    codeEIC: string;
    raisonSociale: string;
    format?: string;
    légende?: string;
  }[];
};

export type GetProjectDataForChoisirCDCPage = (
  projectId: string,
) => ResultAsync<ProjectDataForChoisirCDCPage, EntityNotFoundError | InfraNotAvailableError>;
