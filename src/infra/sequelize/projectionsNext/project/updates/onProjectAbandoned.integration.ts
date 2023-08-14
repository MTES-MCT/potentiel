import { beforeAll, describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import { ProjectAbandoned } from '../../../../../modules/project';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onProjectAbandoned } from './onProjectAbandoned';
import { UniqueEntityID } from '../../../../../core/domain';
import { Project } from "../..";

describe('project.onProjectAbandoned', () => {
  const projectId = new UniqueEntityID().toString();

  const fakeProjects = [
    {
      id: projectId,
      dcrDueOn: 1,
      completionDueOn: 1,
    },
  ].map(makeFakeProject);

  beforeAll(async () => {
    await resetDatabase();
    await Project.bulkCreate(fakeProjects);

    const originalProject = await Project.findByPk(projectId);
    expect(originalProject?.abandonedOn).toEqual(0);

    await onProjectAbandoned(
      new ProjectAbandoned({
        payload: {
          projectId: projectId,
          abandonAcceptedBy: new UniqueEntityID().toString(),
        },
        original: {
          version: 1,
          occurredAt: new Date(1234),
        },
      }),
    );
  });

  it('should set project.abandonedOn', async () => {
    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.abandonedOn).toEqual(1234);
  });

  it('should reset project dcrDueOn and completionDueOn', async () => {
    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.dcrDueOn).toEqual(0);
    expect(updatedProject?.completionDueOn).toEqual(0);
  });
});
