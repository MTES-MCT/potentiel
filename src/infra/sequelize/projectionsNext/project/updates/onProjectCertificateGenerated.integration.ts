import { resetDatabase } from '../../../helpers';
import { ProjectCertificateGenerated } from '@modules/project';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onProjectCertificateGenerated } from './onProjectCertificateGenerated';
import { v4 as uuid } from 'uuid';
import { Project } from '../project.model';
import { File } from '../../file/file.model';

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

  beforeEach(async () => {
    await resetDatabase();

    await Project.bulkCreate(fakeProjects);
    await File.create({
      id: certificateFile1,
      filename: '',
      designation: '',
    });
  });

  it('should update project.certificateFileId on ProjectCertificateGenerated', async () => {
    await onProjectCertificateGenerated(
      new ProjectCertificateGenerated({
        payload: {
          certificateFileId: certificateFile2,
          projectId: projectId,
          projectVersionDate: new Date(0),
          candidateEmail: '',
          periodeId: '',
          appelOffreId: '',
        },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.certificateFileId).toEqual(certificateFile2);

    const nonUpdatedProject = await Project.findByPk(fakeProjectId);
    expect(nonUpdatedProject).toBeDefined();
    expect(nonUpdatedProject?.certificateFileId).toEqual(null);
  });
});
