import { wrapInfra, ResultAsync, errAsync, okAsync } from '@core/utils'
import { ModificationRequestType } from '@modules/modificationRequest'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'
import models from '../../models'

const { ModificationRequest } = models

export const getModificationRequestType = (
  modificationRequestId: string
): ResultAsync<ModificationRequestType, EntityNotFoundError | InfraNotAvailableError> => {
  return wrapInfra(ModificationRequest.findByPk(modificationRequestId)).andThen(
    (modificationRequest) =>
      modificationRequest ? okAsync(modificationRequest.type) : errAsync(new EntityNotFoundError())
  )
}
