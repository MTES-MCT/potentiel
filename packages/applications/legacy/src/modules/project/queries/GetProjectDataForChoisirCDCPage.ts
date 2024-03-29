import { ResultAsync } from '../../../core/utils';
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared';
import { ProjectAppelOffre } from '../../../entities';
import { CahierDesChargesRéférence } from '@potentiel-domain/appel-offre';

export type ProjectDataForChoisirCDCPage = {
  id: string;
  appelOffre: ProjectAppelOffre;
  cahierDesChargesActuel: CahierDesChargesRéférence;
  identifiantGestionnaireRéseau?: string;
  délaiCDC2022Appliqué?: true;
};

export type GetProjectDataForChoisirCDCPage = (
  projectId: string,
) => ResultAsync<ProjectDataForChoisirCDCPage, EntityNotFoundError | InfraNotAvailableError>;
