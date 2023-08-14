import { ResultAsync } from '../../../core/utils';
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared';
import { ProjectAppelOffre, CahierDesChargesRéférence } from '../../../entities';

export type ProjectDataForChoisirCDCPage = {
  id: string;
  appelOffre: ProjectAppelOffre;
  cahierDesChargesActuel: CahierDesChargesRéférence;
  identifiantGestionnaireRéseau?: string;
};

export type GetProjectDataForChoisirCDCPage = (
  projectId: string,
) => ResultAsync<ProjectDataForChoisirCDCPage, EntityNotFoundError | InfraNotAvailableError>;
