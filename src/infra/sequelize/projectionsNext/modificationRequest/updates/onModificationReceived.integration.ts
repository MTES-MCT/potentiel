import { describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import { ModificationReceived } from '@modules/modificationRequest';
import { ModificationRequest } from '@infra/sequelize/projectionsNext';
import { onModificationReceived } from './onModificationReceived';

describe('modificationRequest.onModificationReceived', () => {
  const modificationRequestId = new UniqueEntityID().toString();
  const projectId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();

  it('should create a Modification Request with a status of information validée', async () => {
    await onModificationReceived(
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

    const modificationRequest = await ModificationRequest.findByPk(modificationRequestId);

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
