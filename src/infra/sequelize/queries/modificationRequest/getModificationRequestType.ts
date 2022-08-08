import { wrapInfra, ResultAsync } from '@core/utils'
import { ModificationRequestType } from '@modules/modificationRequest'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'
import models from '../../models'

const { ModificationRequest } = models

export function getModificationRequestType(
  modificationRequestId: string
): ResultAsync<ModificationRequestType, EntityNotFoundError | InfraNotAvailableError> {
  return wrapInfra(ModificationRequest.findByPk(modificationRequestId)).map(({ type }) => type)
}
