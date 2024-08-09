import { ResultAsync } from '../../../core/utils';
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared';
import { ProjectAppelOffre } from '../../../entities';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export type ProjectDataForChoisirCDCPage = {
  id: string;
  appelOffre: ProjectAppelOffre;
  cahierDesChargesActuel: AppelOffre.CahierDesChargesRéférence;
  identifiantGestionnaireRéseau?: string;
  délaiCDC2022Appliqué?: true;
};

export type GetProjectDataForChoisirCDCPage = (
  projectId: string,
) => ResultAsync<ProjectDataForChoisirCDCPage, EntityNotFoundError | InfraNotAvailableError>;
