import models from '../../models'

const { ModificationRequest } = models
export const getModificationRequestAuthority = (
  modificationRequestId: string
): Promise<'dreal' | 'dgec' | undefined> =>
  ModificationRequest.findOne({
    where: { id: modificationRequestId },
    attributes: ['authority'],
  }).then(({ dataValues: { authority = null } }) => authority)
