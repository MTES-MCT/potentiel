import { UniqueEntityID } from '@core/domain';
import models from '../../../models';
import { onModificationRequestCancelled } from './onModificationRequestCancelled';
import { ModificationRequestCancelled } from '@modules/modificationRequest';
import { resetDatabase } from '@dataAccess';

describe(`Projection de l'annulation d'une demande`, () => {
  const { ModificationRequest } = models;

  const modificationRequestId = new UniqueEntityID().toString();
  const projectId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();

  beforeEach(async () => {
    // Create the tables and remove all data
    await resetDatabase();

    await ModificationRequest.create({
      id: modificationRequestId,
      projectId,
      userId,
      type: 'abandon',
      status: 'envoyée',
      requestedOn: 1,
    });

    await onModificationRequestCancelled(models)(
      new ModificationRequestCancelled({
        payload: {
          modificationRequestId,
          cancelledBy: userId,
        },
        original: {
          version: 1,
          occurredAt: new Date(123),
        },
      }),
    );
  });

  it('should update status to demande annulée', async () => {
    const updatedModificationRequest = await ModificationRequest.findByPk(modificationRequestId);
    expect(updatedModificationRequest?.status).toEqual('annulée');
  });

  it('should set cancelledBy and cancelledOn', async () => {
    const updatedModificationRequest = await ModificationRequest.findByPk(modificationRequestId);
    expect(updatedModificationRequest?.cancelledBy).toEqual(userId);
    expect(updatedModificationRequest?.cancelledOn).toEqual(123);
  });
});
