import { ResultAsync } from '@core/utils';
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared';
import { ProjectInfoForModificationReceivedNotificationDTO } from '../dtos';

export type GetProjectInfoForModificationReceivedNotification = (
  projectId: string,
) => ResultAsync<
  ProjectInfoForModificationReceivedNotificationDTO,
  EntityNotFoundError | InfraNotAvailableError
>;
