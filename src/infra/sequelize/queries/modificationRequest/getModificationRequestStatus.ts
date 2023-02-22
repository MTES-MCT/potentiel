import { errAsync, okAsync, wrapInfra } from '@core/utils';
import { GetModificationRequestStatus } from '@modules/modificationRequest';
import { EntityNotFoundError } from '@modules/shared';
import models from '../../models';

const { ModificationRequest } = models;
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
