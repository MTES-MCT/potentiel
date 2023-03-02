import { resetDatabase } from '../../../helpers';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { UniqueEntityID } from '@core/domain';
import { onProjectClaimed } from './onProjectClaimed';
import { ProjectClaimed } from '@modules/projectClaim';
import { Project } from '../project.model';

describe('project.onProjectClaimed', () => {
  const projectId = new UniqueEntityID().toString();

  const fakeProject = makeFakeProject({
    id: projectId,
    email: 'old@test.test',
  });

  describe('on ProjectClaimed', () => {
    const attestationDesignationFileId = new UniqueEntityID().toString();

    beforeAll(async () => {
      await resetDatabase();
      await Project.create(fakeProject);

      const originalProject = await Project.findByPk(projectId);
      expect(originalProject?.email).toEqual('old@test.test');

      await onProjectClaimed(
        new ProjectClaimed({
          payload: {
            projectId: projectId,
            claimedBy: new UniqueEntityID().toString(),
            claimerEmail: 'new@test.test',
            attestationDesignationFileId,
          },
        }),
      );
    });

    it('should udpdate the project email', async () => {
      const updatedProject = await Project.findByPk(projectId);
      expect(updatedProject?.email).toEqual('new@test.test');
    });

    it('should udpdate the project certificateFile', async () => {
      const updatedProject = await Project.findByPk(projectId);
      expect(updatedProject?.certificateFileId).toEqual(attestationDesignationFileId);
    });

    describe('when the project already has a certificate', () => {
      const originalCertificateFileId = new UniqueEntityID().toString();
      const attestationDesignationFileId = new UniqueEntityID().toString();
      beforeAll(async () => {
        await resetDatabase();
        await Project.create({ ...fakeProject, certificateFileId: originalCertificateFileId });

        const originalProject = await Project.findByPk(projectId);
        expect(originalProject?.certificateFileId).toEqual(originalCertificateFileId);

        await onProjectClaimed(
          new ProjectClaimed({
            payload: {
              projectId: projectId,
              claimedBy: new UniqueEntityID().toString(),
              claimerEmail: 'new@test.test',
              attestationDesignationFileId,
            },
          }),
        );
      });

      it('should not udpdate the project certificateFile', async () => {
        const updatedProject = await Project.findByPk(projectId);
        expect(updatedProject?.certificateFileId).toEqual(originalCertificateFileId);
      });
    });
  });
});
