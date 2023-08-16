import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../../core/domain';
import {
  ProjectCertificateRegenerated,
  ProjectCertificateRegeneratedPayload,
} from '../../../../../modules/project';
import { resetDatabase } from '../../../helpers';
import { ProjectEvent } from '../..';
import onProjectCertificateRegenerated from './onProjectCertificateRegenerated';

describe('onProjectCertificateRegenerated', () => {
  const projectId = new UniqueEntityID().toString();

  beforeEach(async () => {
    await resetDatabase();
  });

  it('should create a new project event of type ProjectCertificateRegenerated', async () => {
    const occurredAt = new Date('2021-12-15');

    await onProjectCertificateRegenerated(
      new ProjectCertificateRegenerated({
        payload: {
          projectId,
          certificateFileId: 'file-id',
        } as ProjectCertificateRegeneratedPayload,
        original: {
          version: 1,
          occurredAt,
        },
      }),
    );

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } });

    expect(projectEvent).not.toBeNull();

    expect(projectEvent).toMatchObject({
      type: 'ProjectCertificateRegenerated',
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      payload: { certificateFileId: 'file-id' },
    });
  });
});
