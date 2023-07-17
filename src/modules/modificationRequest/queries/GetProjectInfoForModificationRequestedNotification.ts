import { ResultAsync } from '@core/utils';
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared';
import { ProjectInfoForModificationRequestedNotificationDTO } from '../dtos';

export type GetProjectInfoForModificationRequestedNotification = (
  projectId: string,
) => ResultAsync<
  ProjectInfoForModificationRequestedNotificationDTO,
  EntityNotFoundError | InfraNotAvailableError
>;
