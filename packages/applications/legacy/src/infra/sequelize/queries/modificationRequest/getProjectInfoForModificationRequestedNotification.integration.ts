import { beforeAll, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../core/domain';
import { resetDatabase } from '../../helpers';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { getProjectInfoForModificationRequestedNotification } from './getProjectInfoForModificationRequestedNotification';
import { Project, User, UserProjects } from '../../projectionsNext';

describe('Sequelize getProjectInfoForModificationRequestedNotification', () => {
  const projectId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();
  const userId2 = new UniqueEntityID().toString();

  const projectInfo = {
    id: projectId,
    nomProjet: 'nomProjet',
    departementProjet: 'departement',
    regionProjet: 'region',
  };

  const project = makeFakeProject(projectInfo);

  beforeAll(async () => {
    await resetDatabase();

    await Project.create(project);
    await User.create(makeFakeUser({ id: userId, fullName: 'pp1', email: 'pp1@test.test' }));
    await User.create(makeFakeUser({ id: userId2, fullName: 'pp2', email: 'pp2@test.test' }));

    await UserProjects.bulkCreate([
      {
        userId,
        projectId,
      },
      {
        userId: userId2,
        projectId,
      },
    ]);
  });

  it('should return a complete ModificationRequestUpdateInfoDTO', async () => {
    const result = await getProjectInfoForModificationRequestedNotification(projectId.toString());

    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;

    const DTO = result.value;

    expect(DTO).toEqual({
      nomProjet: 'nomProjet',
      departementProjet: 'departement',
      regionProjet: 'region',
      appelOffreId: project.appelOffreId,
      périodeId: project.periodeId,
      porteursProjet: expect.arrayContaining([
        {
          id: userId,
          fullName: 'pp1',
          email: 'pp1@test.test',
        },
        {
          id: userId2,
          fullName: 'pp2',
          email: 'pp2@test.test',
        },
      ]),
    });
  });
});
