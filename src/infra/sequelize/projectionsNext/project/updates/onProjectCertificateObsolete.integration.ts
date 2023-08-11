import { describe, expect, it } from '@jest/globals';
import { ProjectCertificateObsolete } from '@modules/project';
import { v4 as uuid } from 'uuid';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../../helpers';
import { onProjectCertificateObsolete } from './onProjectCertificateObsolete';
import { Project } from '@infra/sequelize/projectionsNext';

describe('project.onProjectCertificateObsolete', () => {
  const projectId = uuid();

  const certificateFileId = uuid();

  const fakeProjects = [
    {
      id: projectId,
      certificateFileId,
    },
  ].map(makeFakeProject);

  beforeEach(async () => {
    await resetDatabase();

    await Project.bulkCreate(fakeProjects);
  });

  it('should remove project.certificateFileId', async () => {
    await onProjectCertificateObsolete(
      new ProjectCertificateObsolete({
        payload: {
          projectId,
        },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.certificateFileId).toBeNull();
  });
});
