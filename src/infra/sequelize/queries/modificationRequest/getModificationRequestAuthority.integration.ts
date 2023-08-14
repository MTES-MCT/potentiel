import { beforeAll, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../core/domain';
import { ModificationRequest } from "../../projectionsNext";
import { resetDatabase } from '../../helpers';
import { getModificationRequestAuthority } from './getModificationRequestAuthority';

describe('Sequelize getModificationRequestAuthority', () => {
  const projectId = new UniqueEntityID().toString();
  const modificationRequestId = new UniqueEntityID().toString();
  const versionDate = new Date(456);

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();

    await ModificationRequest.create({
      id: modificationRequestId,
      projectId,
      type: 'abandon',
      requestedOn: 123,
      status: 'envoyée',
      versionDate,
      authority: 'dreal',
    });
  });

  it('should return authority', async () => {
    const authority = await getModificationRequestAuthority(modificationRequestId);
    expect(authority).toEqual('dreal');
  });
});
