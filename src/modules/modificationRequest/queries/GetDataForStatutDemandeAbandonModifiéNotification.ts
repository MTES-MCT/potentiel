import { ResultAsync } from '../../../core/utils';
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared';
import { DataForStatutDemandeAbandonModifiéNotificationDTO } from '../dtos';

export type GetDataForStatutDemandeAbandonModifiéNotification = {
  (modificationRequestId: string): ResultAsync<
    DataForStatutDemandeAbandonModifiéNotificationDTO,
    EntityNotFoundError | InfraNotAvailableError
  >;
};
