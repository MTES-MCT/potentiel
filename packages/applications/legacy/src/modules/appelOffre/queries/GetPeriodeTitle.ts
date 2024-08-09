import { ResultAsync } from '../../../core/utils';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared';

export type GetPeriodeTitle = (
  appelOffreId: AppelOffre.AppelOffreReadModel['id'],
  periodeId: AppelOffre.Periode['id'],
) => ResultAsync<
  {
    appelOffreTitle: string;
    periodeTitle: string;
  },
  InfraNotAvailableError | EntityNotFoundError
>;
