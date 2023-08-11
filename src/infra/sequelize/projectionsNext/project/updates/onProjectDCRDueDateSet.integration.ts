import { describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import { ProjectDCRDueDateSet } from '@modules/project';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onProjectDCRDueDateSet } from './onProjectDCRDueDateSet';
import { v4 as uuid } from 'uuid';
import { Project } from '@infra/sequelize/projectionsNext';

describe('project.onProjectDCRDueDateSet', () => {
  const projectId = uuid();
  const fakeProjectId = uuid();

  const fakeProjects = [
    {
      id: projectId,
      dcrDueOn: 0,
    },
    {
      id: fakeProjectId,
      dcrDueOn: 0,
    },
  ].map(makeFakeProject);

  beforeAll(async () => {
    await resetDatabase();
    await Project.bulkCreate(fakeProjects);
  });

  it('should update project.dcrDueOn', async () => {
    await onProjectDCRDueDateSet(
      new ProjectDCRDueDateSet({
        payload: {
          projectId: projectId,
          dcrDueOn: 12345,
        },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.dcrDueOn).toEqual(12345);

    const nonUpdatedProject = await Project.findByPk(fakeProjectId);
    expect(nonUpdatedProject).toBeDefined();
    expect(nonUpdatedProject?.dcrDueOn).toEqual(0);
  });
});
