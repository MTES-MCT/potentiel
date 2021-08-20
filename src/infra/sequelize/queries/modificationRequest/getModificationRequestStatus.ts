import { wrapInfra } from '../../../../core/utils'
import { GetModificationRequestStatus } from '../../../../modules/modificationRequest'
import models from '../../models'

const { ModificationRequest } = models
export const getModificationRequestStatus: GetModificationRequestStatus = (
  modificationRequestId: string
) => {
  return wrapInfra(ModificationRequest.findByPk(modificationRequestId)).map(({ status }) => status)
}
