import { wrapInfra, ResultAsync, errAsync, okAsync } from '../../../../core/utils';
import { ModificationRequest } from '../../projectionsNext';
import { ModificationRequestType } from '../../../../modules/modificationRequest';
import { EntityNotFoundError, InfraNotAvailableError } from '../../../../modules/shared';

export const getModificationRequestType = (
  modificationRequestId: string,
): ResultAsync<ModificationRequestType, EntityNotFoundError | InfraNotAvailableError> => {
  return wrapInfra(ModificationRequest.findByPk(modificationRequestId)).andThen(
    (modificationRequest) =>
      modificationRequest ? okAsync(modificationRequest.type) : errAsync(new EntityNotFoundError()),
  );
};
