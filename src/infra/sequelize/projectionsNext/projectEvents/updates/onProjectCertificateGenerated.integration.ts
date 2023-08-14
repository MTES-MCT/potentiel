import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import { ProjectCertificateGenerated, ProjectCertificateGeneratedPayload } from '@modules/project';
import { resetDatabase } from '../../../helpers';
import { ProjectEvent } from '@infra/sequelize/projectionsNext';
import onProjectCertificateGenerated from './onProjectCertificateGenerated';

describe('onProjectCertificateGenerated', () => {
  const projectId = new UniqueEntityID().toString();

  beforeEach(async () => {
    await resetDatabase();
  });

  it('should create a new project event of type ProjectCertificateGenerated', async () => {
    const occurredAt = new Date('2021-12-15');

    await onProjectCertificateGenerated(
      new ProjectCertificateGenerated({
        payload: {
          projectId,
          certificateFileId: 'file-id',
        } as ProjectCertificateGeneratedPayload,
        original: {
          version: 1,
          occurredAt,
        },
      }),
    );

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } });

    expect(projectEvent).not.toBeNull();
    expect(projectEvent).toMatchObject({
      type: 'ProjectCertificateGenerated',
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      payload: { certificateFileId: 'file-id' },
    });
  });
});
