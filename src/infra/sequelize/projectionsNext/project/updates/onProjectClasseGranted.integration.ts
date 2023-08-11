import { beforeAll, describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onProjectClasseGranted } from './onProjectClasseGranted';
import { ProjectClasseGranted } from '@modules/project';
import { v4 as uuid } from 'uuid';
import { Project } from '@infra/sequelize/projectionsNext';

describe('project.onProjectClasseGranted', () => {
  const projectId = uuid();
  const fakeProjects = [
    {
      id: projectId,
      classe: 'Eliminé',
    },
  ].map(makeFakeProject);

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();

    await Project.bulkCreate(fakeProjects);
  });

  it('should update project.classe to Classé', async () => {
    await onProjectClasseGranted(
      new ProjectClasseGranted({
        payload: {
          projectId,
          grantedBy: 'user1',
        },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.classe).toEqual('Classé');
  });
});
