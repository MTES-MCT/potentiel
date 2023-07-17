import { ResultAsync } from '@core/utils';
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared';
import { DataForAbandonConfirméNotificationDTO } from '../dtos';

export type GetDataForAbandonConfirméNotification = {
  (modificationRequestId: string): ResultAsync<
    DataForAbandonConfirméNotificationDTO,
    EntityNotFoundError | InfraNotAvailableError
  >;
};
