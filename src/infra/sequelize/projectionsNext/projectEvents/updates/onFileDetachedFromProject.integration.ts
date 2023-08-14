import { describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import { FileDetachedFromProject } from '../../../../../modules/file';
import { resetDatabase } from '../../../helpers';
import { ProjectEvent } from '@infra/sequelize/projectionsNext';
import onFileDetachedFromProject from './onFileDetachedFromProject';

describe('onFileDetachedFromProject', () => {
  const projectId = new UniqueEntityID().toString();
  const attachmentId = new UniqueEntityID().toString();
  const detachedBy = 'user-id';

  beforeEach(async () => {
    await resetDatabase();
    try {
      await ProjectEvent.create({
        id: attachmentId,
        type: 'FileAttachedToProject',
        projectId,
        valueDate: Date.now(),
        eventPublishedAt: Date.now(),
        payload: {},
      });
    } catch (error) {
      console.log(error);
    }
  });

  it('should create a new project event of type FileDetachedFromProject', async () => {
    await onFileDetachedFromProject(
      new FileDetachedFromProject({
        payload: {
          attachmentId,
          detachedBy,
        },
      }),
    );

    const projectEvent = await ProjectEvent.findOne({ where: { id: attachmentId } });

    expect(projectEvent).toBeNull();
  });
});
