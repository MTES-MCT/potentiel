import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../core/domain';
import { User } from '../../../../entities';
import { resetDatabase } from '../../helpers';
import { ProjectEvent } from '../../projectionsNext/projectEvents/projectEvent.model';
import { getProjectEvents } from './getProjectEvents';
import { Project } from "../../projectionsNext";
import makeFakeProject from '../../../../__tests__/fixtures/project';

describe('getProjectEvents en général', () => {
  const projectId = new UniqueEntityID().toString();
  const fakeProject = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' });
  const eventTimestamp = new Date().getTime();

  // liste des événements à tester

  beforeEach(async () => {
    await resetDatabase();
    await Project.create(fakeProject);
  });

  it(`Les événements devraient être retournés triés par eventPublishedAt`, async () => {
    const fakeUser = { role: 'porteur-projet' } as User;

    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: 'ProjectCertificateGenerated',
      valueDate: eventTimestamp,
      eventPublishedAt: new Date('2022-01-01').getTime(),
      payload: { certificateFileId: 'fileId' },
    });

    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: 'ProjectCertificateRegenerated',
      valueDate: eventTimestamp,
      eventPublishedAt: new Date('2022-01-03').getTime(),
      payload: { certificateFileId: 'fileId' },
    });

    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: 'ProjectCertificateUpdated',
      valueDate: eventTimestamp,
      eventPublishedAt: new Date('2022-01-04').getTime(),
      payload: { certificateFileId: 'fileId' },
    });

    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: 'ProjectClaimed',
      valueDate: eventTimestamp,
      eventPublishedAt: new Date('2022-01-02').getTime(),
      payload: {
        attestationDesignationFileId: 'file-id',
        claimedBy: 'someone',
      },
    });

    const res = await getProjectEvents({ projectId, user: fakeUser });

    expect(res._unsafeUnwrap()).toMatchObject({
      events: [
        {
          type: 'ProjectCertificateGenerated',
        },
        {
          type: 'ProjectClaimed',
        },
        {
          type: 'ProjectCertificateRegenerated',
        },
        {
          type: 'ProjectCertificateUpdated',
        },
      ],
    });
  });
});
