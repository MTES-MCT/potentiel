import { beforeAll, describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import { ProjectCompletionDueDateSet } from '../../../../../modules/project';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onProjectCompletionDueDateSet } from './onProjectCompletionDueDateSet';
import { v4 as uuid } from 'uuid';
import { Project } from '../..';

describe('project.onProjectCompletionDueDateSet', () => {
  const projectId = uuid();
  const fakeProjectId = uuid();

  const fakeProjects = [
    {
      id: projectId,
      completionDueOn: 0,
    },
    {
      id: fakeProjectId,
      completionDueOn: 0,
    },
  ].map(makeFakeProject);

  beforeAll(async () => {
    await resetDatabase();
    await Project.bulkCreate(fakeProjects);
  });

  it('should update project.completionDueOn', async () => {
    await onProjectCompletionDueDateSet(
      new ProjectCompletionDueDateSet({
        payload: {
          projectId,
          completionDueOn: 12345,
        },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.completionDueOn).toEqual(12345);

    const nonUpdatedProject = await Project.findByPk(fakeProjectId);
    expect(nonUpdatedProject).toBeDefined();
    expect(nonUpdatedProject?.completionDueOn).toEqual(0);
  });
});
