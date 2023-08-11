import { describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import { onModificationRequestStatusUpdated } from './onModificationRequestStatusUpdated';
import { ModificationRequestStatusUpdated } from '@modules/modificationRequest';
import { UniqueEntityID } from '@core/domain';
import { ModificationRequest } from '@infra/sequelize/projectionsNext';

describe('modificationRequest.onModificationRequestStatusUpdated', () => {
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

  it('should update status', async () => {
    await onModificationRequestStatusUpdated(
      new ModificationRequestStatusUpdated({
        payload: {
          modificationRequestId,
          updatedBy: userId,
          newStatus: 'acceptée',
        },
        original: {
          occurredAt: new Date(123),
          version: 1,
        },
      }),
    );

    const updatedModificationRequest = await ModificationRequest.findByPk(modificationRequestId);
    expect(updatedModificationRequest?.status).toEqual('acceptée');
    expect(updatedModificationRequest?.respondedBy).toEqual(userId);
    expect(updatedModificationRequest?.respondedOn).toEqual(123);
  });
});
