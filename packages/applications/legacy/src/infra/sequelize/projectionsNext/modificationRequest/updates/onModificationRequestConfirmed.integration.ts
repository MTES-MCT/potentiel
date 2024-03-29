import { beforeAll, describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import { onModificationRequestConfirmed } from './onModificationRequestConfirmed';
import { ModificationRequestConfirmed } from '../../../../../modules/modificationRequest';
import { UniqueEntityID } from '../../../../../core/domain';
import { ModificationRequest } from '../..';

describe('modificationRequest.onModificationRequestConfirmed', () => {
  const modificationRequestId = new UniqueEntityID().toString();
  const projectId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();
  const fileId = new UniqueEntityID().toString();

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();

    await ModificationRequest.create({
      id: modificationRequestId,
      projectId,
      userId,
      type: 'recours',
      status: 'en attente de confirmation',
      requestedOn: 1,
    });

    await onModificationRequestConfirmed(
      new ModificationRequestConfirmed({
        payload: {
          modificationRequestId,
          confirmedBy: userId,
        },
        original: {
          version: 1,
          occurredAt: new Date(123),
        },
      }),
    );
  });

  it('should update status to demande confirmée', async () => {
    const updatedModificationRequest = await ModificationRequest.findByPk(modificationRequestId);
    expect(updatedModificationRequest?.status).toEqual('demande confirmée');
  });

  it('should set confirmedBy and confirmedOn', async () => {
    const updatedModificationRequest = await ModificationRequest.findByPk(modificationRequestId);
    expect(updatedModificationRequest?.confirmedBy).toEqual(userId);
    expect(updatedModificationRequest?.confirmedOn).toEqual(123);
  });
});
