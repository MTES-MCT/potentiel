import { beforeAll, describe, expect, it } from '@jest/globals';
import { Project } from '../../projectionsNext';
import { resetDatabase } from '../../helpers';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { getUnnotifiedProjectsForPeriode } from './getUnnotifiedProjectsForPeriode';
import { v4 as uuid } from 'uuid';

describe('Sequelize getUnnotifiedProjectsForPeriode', () => {
  const appelOffreId = 'appelOffre1';
  const periodeId = 'periode1';

  const projectId = uuid();

  const fakeProjects = [
    {
      id: projectId,
      email: 'candidate@test.test',
      nomRepresentantLegal: 'john doe',
      appelOffreId: 'appelOffre1',
      periodeId: 'periode1',
      familleId: 'famille1',
      notifiedOn: 0,
    },
    {
      id: uuid(), // notified
      appelOffreId: 'appelOffre1',
      periodeId: 'periode1',
      notifiedOn: 1,
    },
    {
      id: uuid(), // otherPeriode
      appelOffreId: 'appelOffre1',
      periodeId: 'periode2',
      notifiedOn: 0,
    },
    {
      id: uuid(), // otherAppel
      appelOffreId: 'appelOffre2',
      periodeId: 'periode1',
      notifiedOn: 0,
    },
  ].map(makeFakeProject);

  beforeAll(async () => {
    await resetDatabase();
    await Project.bulkCreate(fakeProjects);
  });

  it('should return a list of UnnotifiedProjectDTOs for projects that have not been notified for the specific periode', async () => {
    const projectsResult = await getUnnotifiedProjectsForPeriode(appelOffreId, periodeId);

    expect(projectsResult.isOk()).toBe(true);
    if (projectsResult.isErr()) return;

    const projects = projectsResult.value;

    expect(projects).toHaveLength(1);
    expect(projects).toEqual(
      expect.arrayContaining([
        {
          projectId,
          candidateEmail: 'candidate@test.test',
          candidateName: 'john doe',
          familleId: 'famille1',
        },
      ]),
    );
  });
});
