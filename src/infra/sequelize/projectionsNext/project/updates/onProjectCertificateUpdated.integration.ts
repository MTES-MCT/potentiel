import { resetDatabase } from '../../../helpers';
import { ProjectCertificateUpdated } from '@modules/project';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import models from '../../../models';
import { onProjectCertificateUpdated } from './onProjectCertificateUpdated';
import { v4 as uuid } from 'uuid';
import { Project } from '../project.model';

describe('project.onProjectCertificate', () => {
  const projectId = uuid();
  const fakeProjectId = uuid();

  const certificateFile1 = uuid();
  const certificateFile2 = uuid();

  const fakeProjects = [
    {
      id: projectId,
      certificateFileId: null,
    },
    {
      id: fakeProjectId,
      certificateFileId: null,
    },
  ].map(makeFakeProject);

  const FileModel = models.File;

  beforeEach(async () => {
    await resetDatabase();

    await Project.bulkCreate(fakeProjects);
    await FileModel.create({
      id: certificateFile1,
      filename: '',
      designation: '',
    });
  });

  it('should update project.certificateFileId on ProjectCertificateUpdated', async () => {
    await onProjectCertificateUpdated(
      new ProjectCertificateUpdated({
        payload: {
          certificateFileId: certificateFile1,
          projectId: projectId,
          uploadedBy: 'user1',
        },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.certificateFileId).toEqual(certificateFile1);

    const nonUpdatedProject = await Project.findByPk(fakeProjectId);
    expect(nonUpdatedProject).toBeDefined();
    expect(nonUpdatedProject?.certificateFileId).toEqual(null);
  });
});
