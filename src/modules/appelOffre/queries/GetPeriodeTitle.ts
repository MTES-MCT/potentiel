import { ResultAsync } from '../../../core/utils';
import { AppelOffre, Periode } from '@potentiel-domain/appel-offre';
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared';

export type GetPeriodeTitle = (
  appelOffreId: AppelOffre['id'],
  periodeId: Periode['id'],
) => ResultAsync<
  {
    appelOffreTitle: string;
    periodeTitle: string;
  },
  InfraNotAvailableError | EntityNotFoundError
>;
