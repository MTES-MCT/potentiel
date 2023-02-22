import { ResultAsync } from '@core/utils';
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared';

export interface HasGarantiesFinancières {
  (projetId: string): ResultAsync<boolean, EntityNotFoundError | InfraNotAvailableError>;
}
