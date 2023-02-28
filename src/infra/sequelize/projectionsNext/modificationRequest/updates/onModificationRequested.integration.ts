import { UniqueEntityID } from '@core/domain';
import { ModificationRequested } from '@modules/modificationRequest';
import { ModificationRequest } from "..";
import { resetDatabase } from '../../../helpers';
import models from '../../../models';
import { onModificationRequested } from './onModificationRequested';

describe('modificationRequest.onModificationRequested', () => {
  const projectId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();
  const fileId = new UniqueEntityID().toString();

  beforeEach(async () => {
    // Create the tables and remove all data
    await resetDatabase();
  });

  it('should create a new modificationRequest', async () => {
    const modificationRequestId = new UniqueEntityID().toString();

    const event = new ModificationRequested({
      payload: {
        type: 'recours',
        projectId,
        modificationRequestId,
        fileId,
        justification: 'justification',
        requestedBy: userId,
        authority: 'dgec',
        cahierDesCharges: 'initial',
      },
    });
    await onModificationRequested(models)(event);

    const projection = await ModificationRequest.findByPk(modificationRequestId);

    expect(projection).toBeDefined();
    if (!projection) return;

    const { occurredAt } = event;

    expect(projection.get()).toMatchObject({
      id: modificationRequestId,
      projectId,
      type: 'recours',
      requestedOn: occurredAt.getTime(),
      status: 'envoyée',
      fileId,
      justification: 'justification',
      userId,
      authority: 'dgec',
      cahierDesCharges: 'initial',
    });
  });
});
