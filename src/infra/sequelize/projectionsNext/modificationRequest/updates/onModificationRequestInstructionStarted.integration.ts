import { beforeAll, describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import { onModificationRequestInstructionStarted } from './onModificationRequestInstructionStarted';
import { ModificationRequestInstructionStarted } from '../../../../../modules/modificationRequest';
import { UniqueEntityID } from '../../../../../core/domain';
import { ModificationRequest } from "../..";

describe('modificationRequest.onModificationRequestInstructionStarted', () => {
  const modificationRequestId = new UniqueEntityID().toString();
  const projectId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();

    await ModificationRequest.create({
      id: modificationRequestId,
      projectId,
      userId,
      type: 'recours',
      status: 'envoyée',
      requestedOn: 1,
    });
  });

  it('should update status to en instruction', async () => {
    await onModificationRequestInstructionStarted(
      new ModificationRequestInstructionStarted({
        payload: {
          modificationRequestId,
        },
      }),
    );

    const updatedModificationRequest = await ModificationRequest.findByPk(modificationRequestId);
    expect(updatedModificationRequest?.status).toEqual('en instruction');
  });
});
