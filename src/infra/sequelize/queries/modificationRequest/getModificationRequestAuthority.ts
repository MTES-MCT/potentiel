import { ModificationRequest } from '@infra/sequelize/projectionsNext';

export const getModificationRequestAuthority = (
  modificationRequestId: string,
): Promise<'dreal' | 'dgec' | undefined> =>
  ModificationRequest.findOne({
    where: { id: modificationRequestId },
    attributes: ['authority'],
  }).then((modificationRequest) => modificationRequest?.authority);
