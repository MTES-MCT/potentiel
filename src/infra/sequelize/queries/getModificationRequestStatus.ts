import { errAsync, ResultAsync } from '../../../core/utils'
import { GetModificationRequestStatus } from '../../../modules/modificationRequest'
import { InfraNotAvailableError } from '../../../modules/shared'

export const makeGetModificationRequestStatus = (models): GetModificationRequestStatus => (
  modificationRequestId: string
) => {
  const ModificationRequestModel = models.ModificationRequest
  if (!ModificationRequestModel) return errAsync(new InfraNotAvailableError())

  return ResultAsync.fromPromise(
    ModificationRequestModel.findByPk(modificationRequestId),
    () => new InfraNotAvailableError()
  ).map((modificationRequest: any) => modificationRequest.status)
}
