import { beforeAll, describe, expect, it } from '@jest/globals';
import { Project } from '@infra/sequelize/projectionsNext';
import { resetDatabase } from '../../helpers';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { getProjectDataForProjectClaim } from './getProjectDataForProjectClaim';
import { v4 as uuid } from 'uuid';

describe('Sequelize getProjectDataForProjectClaim', () => {
  const projectId = uuid();

  const fakeProject = [
    {
      id: projectId,
      prixReference: 90,
      nomProjet: 'nomProjet1',
      numeroCRE: '007',
      email: 'candidate@test.test',
    },
  ].map(makeFakeProject);

  beforeAll(async () => {
    await resetDatabase();
    await Project.bulkCreate(fakeProject);
  });

  it('should return a list of ProjectDataForProjectClaim DTO', async () => {
    const projectsResult = await getProjectDataForProjectClaim(projectId);

    expect(projectsResult.isOk()).toBe(true);
    if (projectsResult.isErr()) return;

    const projects = projectsResult.value;

    expect(projects).toMatchObject({
      id: projectId,
      prixReference: 90,
      nomProjet: 'nomProjet1',
      numeroCRE: '007',
      email: 'candidate@test.test',
    });
  });
});
