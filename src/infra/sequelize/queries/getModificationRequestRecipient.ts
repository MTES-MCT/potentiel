import { wrapInfra } from '../../../core/utils'
import { GetModificationRequestRecipient } from '../../../modules/modificationRequest'

export const makeGetModificationRequestRecipient = (models): GetModificationRequestRecipient => (
  modificationRequestId: string
) => {
  const { ModificationRequest } = models

  return wrapInfra(ModificationRequest.findByPk(modificationRequestId)).map(() => 'dgec')
}
