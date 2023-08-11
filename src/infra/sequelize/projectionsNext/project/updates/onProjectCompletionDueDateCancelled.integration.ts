import { beforeAll, describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import { ProjectCompletionDueDateCancelled } from '@modules/project';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onProjectCompletionDueDateCancelled } from './onProjectCompletionDueDateCancelled';
import { v4 as uuid } from 'uuid';
import { Project } from '@infra/sequelize/projectionsNext';

describe('project.onProjectCompletionDueDateCancelled', () => {
  const projectId = uuid();

  const fakeProjects = [
    {
      id: projectId,
      completionDueOn: new Date('2020-01-01').getTime(),
    },
  ].map(makeFakeProject);

  beforeAll(async () => {
    await resetDatabase();
    await Project.bulkCreate(fakeProjects);
  });

  it('should update project.completionDueOn', async () => {
    await onProjectCompletionDueDateCancelled(
      new ProjectCompletionDueDateCancelled({
        payload: {
          projectId,
        },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.completionDueOn).toEqual(0);
  });
});
