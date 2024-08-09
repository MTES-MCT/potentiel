import { ResultAsync } from '../../../core/utils';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared';

export type GetFamille = (
  appelOffreId: AppelOffre.AppelOffreReadModel['id'],
  familleId: AppelOffre.Famille['id'],
) => ResultAsync<AppelOffre.Famille, InfraNotAvailableError | EntityNotFoundError>;
