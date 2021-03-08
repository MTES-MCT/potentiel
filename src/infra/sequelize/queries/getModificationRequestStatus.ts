import { errAsync, wrapInfra } from '../../../core/utils'
import { GetModificationRequestStatus } from '../../../modules/modificationRequest'
import { InfraNotAvailableError } from '../../../modules/shared'

export const makeGetModificationRequestStatus = (models): GetModificationRequestStatus => (
  modificationRequestId: string
) => {
  const ModificationRequestModel = models.ModificationRequest
  if (!ModificationRequestModel) return errAsync(new InfraNotAvailableError())

  return wrapInfra(ModificationRequestModel.findByPk(modificationRequestId)).map(
    ({ status }) => status
  )
}
