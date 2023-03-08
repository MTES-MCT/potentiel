import { UniqueEntityID } from '@core/domain';
import { ModificationRequest } from '@infra/sequelize/projectionsNext';
import { resetDatabase } from '../../helpers';
import { getModificationRequestType } from './getModificationRequestType';

describe('Sequelize getModificationRequestType', () => {
  const projectId = new UniqueEntityID().toString();
  const fileId = new UniqueEntityID().toString();
  const modificationRequestId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();
  const userId2 = new UniqueEntityID().toString();

  const versionDate = new Date(456);

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();

    await ModificationRequest.create({
      id: modificationRequestId,
      projectId,
      userId,
      fileId,
      type: 'delai',
      requestedOn: 123,
      respondedOn: 321,
      respondedBy: userId2,
      status: 'envoyée',
      justification: 'justification',
      versionDate,
    });
  });

  it('Doit retourner le type de la modificationRequest', async () => {
    const type = await getModificationRequestType(modificationRequestId);

    expect(type._unsafeUnwrap()).toEqual('delai');
  });
});
