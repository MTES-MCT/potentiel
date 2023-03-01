import { resetDatabase } from '../../../helpers';
import { onModificationRequestRejected } from './onModificationRequestRejected';
import { ModificationRequestRejected } from '@modules/modificationRequest';
import { UniqueEntityID } from '@core/domain';
import { ModificationRequest } from '..';

describe('modificationRequest.onModificationRequestRejected', () => {
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
  });

  it('should update status to rejetée and add response file', async () => {
    await onModificationRequestRejected(
      new ModificationRequestRejected({
        payload: {
          modificationRequestId,
          rejectedBy: userId,
          responseFileId: fileId,
        },
      }),
    );

    const updatedModificationRequest = await ModificationRequest.findByPk(modificationRequestId);
    expect(updatedModificationRequest?.status).toEqual('rejetée');
    expect(updatedModificationRequest?.responseFileId).toEqual(fileId);
  });
});
