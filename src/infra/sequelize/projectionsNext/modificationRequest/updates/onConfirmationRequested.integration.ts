import { resetDatabase } from '@infra/sequelize/helpers';
import { ConfirmationRequested } from '@modules/modificationRequest';
import { UniqueEntityID } from '@core/domain';
import { ModificationRequest } from '@infra/sequelize/projectionsNext';
import { onConfirmationRequested } from './onConfirmationRequested';

describe('modificationRequest.onConfirmationRequested', () => {
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
      status: 'envoyée',
      requestedOn: 1,
    });

    await onConfirmationRequested(
      new ConfirmationRequested({
        payload: {
          modificationRequestId,
          confirmationRequestedBy: userId,
          responseFileId: fileId,
        },
        original: {
          version: 1,
          occurredAt: new Date(123),
        },
      }),
    );
  });

  it('should update status to en attente de confirmation', async () => {
    const updatedModificationRequest = await ModificationRequest.findByPk(modificationRequestId);
    expect(updatedModificationRequest?.status).toEqual('en attente de confirmation');
  });

  it('should add response file', async () => {
    const updatedModificationRequest = await ModificationRequest.findByPk(modificationRequestId);
    expect(updatedModificationRequest?.responseFileId).toEqual(fileId);
  });

  it('should set confirmationRequestedBy and confirmationRequestedOn', async () => {
    const updatedModificationRequest = await ModificationRequest.findByPk(modificationRequestId);
    expect(updatedModificationRequest?.confirmationRequestedBy).toEqual(userId);
    expect(updatedModificationRequest?.confirmationRequestedOn).toEqual(123);
  });
});
