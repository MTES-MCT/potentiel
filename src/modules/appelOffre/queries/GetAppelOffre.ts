import { ResultAsync } from '@core/utils';
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared';
import { AppelOffreDTO } from '../dtos';

export type GetAppelOffre = (
  appelOffreId: string,
) => ResultAsync<AppelOffreDTO, InfraNotAvailableError | EntityNotFoundError>;
