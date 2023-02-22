import { UniqueEntityID } from '@core/domain';
import { ModificationReceived } from '@modules/modificationRequest';
import models from '../../../models';
import { onModificationReceived } from './onModificationReceived';

describe('modificationRequest.onModificationReceived', () => {
  const ModificationRequestModel = models.ModificationRequest;

  const modificationRequestId = new UniqueEntityID().toString();
  const projectId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();

  it('should create a Modification Request with a status of information validée', async () => {
    await onModificationReceived(models)(
      new ModificationReceived({
        payload: {
          modificationRequestId,
          type: 'puissance',
          projectId,
          requestedBy: userId,
          puissance: 104,
          authority: 'dgec',
          cahierDesCharges: 'initial',
        },
      }),
    );

    const modificationRequest = await ModificationRequestModel.findByPk(modificationRequestId);

    expect(modificationRequest).toMatchObject({
      puissance: 104,
      type: 'puissance',
      projectId,
      userId,
      status: 'information validée',
      authority: 'dgec',
      cahierDesCharges: 'initial',
    });
  });
});
