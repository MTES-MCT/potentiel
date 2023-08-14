import { beforeAll, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import { ModificationRequest } from '@infra/sequelize/projectionsNext';
import { resetDatabase } from '../../helpers';
import { getModificationRequestStatus } from './getModificationRequestStatus';

describe('Sequelize getModificationRequestStatus', () => {
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
      type: 'recours',
      requestedOn: 123,
      respondedOn: 321,
      respondedBy: userId2,
      status: 'envoyée',
      justification: 'justification',
      versionDate,
    });
  });

  it('should return status', async () => {
    const statusResult = await getModificationRequestStatus(modificationRequestId);

    expect(statusResult._unsafeUnwrap()).toEqual('envoyée');
  });
});
