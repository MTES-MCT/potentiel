import { beforeEach, describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import { ProjectNotified } from '../../../../../modules/project';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { v4 as uuid } from 'uuid';
import { Project } from "../..";
import { onProjectNotified } from './onProjectNotified';

describe('project.onProjectNotified', () => {
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

  it('should update project.notifiedOn on ProjectNotified', async () => {
    await onProjectNotified(
      new ProjectNotified({
        payload: {
          projectId,
          notifiedOn: 56789,
          candidateEmail: '',
          candidateName: '',
          periodeId: '',
          appelOffreId: '',
          familleId: '',
        },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.notifiedOn).toEqual(56789);

    const nonUpdatedProject = await Project.findByPk(fakeProjectId);
    expect(nonUpdatedProject).toBeDefined();
    expect(nonUpdatedProject?.notifiedOn).toEqual(0);
  });
});
