import { errAsync, okAsync, wrapInfra } from '@core/utils';
import { ModificationRequest } from '@infra/sequelize/projectionsNext';
import { GetModificationRequestStatus } from '@modules/modificationRequest';
import { EntityNotFoundError } from '@modules/shared';

export const getModificationRequestStatus: GetModificationRequestStatus = (
  modificationRequestId: string,
) => {
  return wrapInfra(ModificationRequest.findByPk(modificationRequestId)).andThen(
    (modificationRequest) =>
      modificationRequest
        ? okAsync(modificationRequest.status)
        : errAsync(new EntityNotFoundError()),
  );
};
