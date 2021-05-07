import { errAsync, wrapInfra } from '../../../core/utils'
import { GetModificationRequestRecipient } from '../../../modules/modificationRequest'
import { InfraNotAvailableError } from '../../../modules/shared'

export const makeGetModificationRequestRecipient = (models): GetModificationRequestRecipient => (
  modificationRequestId: string
) => {
  const { ModificationRequest } = models
  if (!ModificationRequest) return errAsync(new InfraNotAvailableError())

  return wrapInfra(ModificationRequest.findByPk(modificationRequestId)).map(() => 'dgec')
}
