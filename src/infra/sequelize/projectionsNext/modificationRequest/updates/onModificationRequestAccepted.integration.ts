import { resetDatabase } from '../../../helpers';
import { onModificationRequestAccepted } from './onModificationRequestAccepted';
import {
  ModificationRequestAcceptanceParams,
  ModificationRequestAccepted,
} from '@modules/modificationRequest';
import { UniqueEntityID } from '@core/domain';
import { ModificationRequest } from '@infra/sequelize/projectionsNext';

describe('modificationRequest.onModificationRequestAccepted', () => {
  const modificationRequestId = new UniqueEntityID().toString();
  const projectId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();
  const responseFileId = new UniqueEntityID().toString();

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

  it('should update status to accepté and insert acceptance params', async () => {
    const params = {
      type: 'recours',
      newNotificationDate: new Date('2022-06-20'),
    } as ModificationRequestAcceptanceParams;

    await onModificationRequestAccepted(
      new ModificationRequestAccepted({
        payload: {
          modificationRequestId,
          acceptedBy: userId,
          responseFileId,
          params,
        },
      }),
    );

    const updatedModificationRequest = await ModificationRequest.findByPk(modificationRequestId);
    expect(updatedModificationRequest?.status).toEqual('acceptée');
    expect(updatedModificationRequest?.responseFileId).toEqual(responseFileId);
    expect(updatedModificationRequest?.acceptanceParams?.type).toEqual('recours');
    expect(updatedModificationRequest?.acceptanceParams?.newNotificationDate).toEqual(
      new Date('2022-06-20').toISOString(),
    );
  });
});
