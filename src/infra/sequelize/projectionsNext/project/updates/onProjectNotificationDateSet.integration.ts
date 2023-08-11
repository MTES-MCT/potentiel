import { beforeEach, describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import { ProjectNotificationDateSet } from '@modules/project';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onProjectNotificationDateSet } from './onProjectNotificationDateSet';
import { v4 as uuid } from 'uuid';
import { Project } from '@infra/sequelize/projectionsNext';

describe('project.onProjectNotificationDateSet', () => {
  const projectId = uuid();
  const fakeProjectId = uuid();

  const fakeProjects = [
    {
      id: projectId,
      notifiedOn: 0,
    },
    {
      id: fakeProjectId,
      notifiedOn: 0,
    },
  ].map(makeFakeProject);

  beforeEach(async () => {
    await resetDatabase();
    await Project.bulkCreate(fakeProjects);
  });

  it('should update project.notifiedOn on ProjectNotificationDateSet', async () => {
    await onProjectNotificationDateSet(
      new ProjectNotificationDateSet({
        payload: {
          projectId,
          setBy: 'user1',
          notifiedOn: 12345,
        },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.notifiedOn).toEqual(12345);

    const nonUpdatedProject = await Project.findByPk(fakeProjectId);
    expect(nonUpdatedProject).toBeDefined();
    expect(nonUpdatedProject?.notifiedOn).toEqual(0);
  });
});
