import { wrapInfra } from '@core/utils'
import { GetModificationRequestRecipient } from '@modules/modificationRequest'
import models from '../../models'

const { ModificationRequest } = models
export const getModificationRequestRecipient: GetModificationRequestRecipient = (
  modificationRequestId: string
) => {
  return wrapInfra(ModificationRequest.findByPk(modificationRequestId)).map(() => 'dgec')
}
