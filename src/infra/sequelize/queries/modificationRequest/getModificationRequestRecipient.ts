import { wrapInfra } from '@core/utils';
import { ModificationRequest } from '@infra/sequelize/projectionsNext';
import { GetModificationRequestRecipient } from '@modules/modificationRequest';

export const getModificationRequestRecipient: GetModificationRequestRecipient = (
  modificationRequestId: string,
) => {
  return wrapInfra(ModificationRequest.findByPk(modificationRequestId)).map(() => 'dgec');
};
