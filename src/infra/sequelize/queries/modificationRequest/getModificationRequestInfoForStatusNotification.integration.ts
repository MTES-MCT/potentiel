import { describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { getModificationRequestInfoForStatusNotification } from './getModificationRequestInfoForStatusNotification';
import { ModificationRequest, Project, User, UserProjects } from '@infra/sequelize/projectionsNext';

describe('Sequelize getModificationRequestInfoForStatusNotification', () => {
  it('should return a complete ModificationRequestUpdateInfoDTO', async () => {
    const projectId = new UniqueEntityID().toString();
    const modificationRequestId = new UniqueEntityID().toString();
    const userId = new UniqueEntityID().toString();
    const userId2 = new UniqueEntityID().toString();

    const project = makeFakeProject({
      id: projectId,
      nomProjet: 'nomProjet',
      departementProjet: 'departement',
      regionProjet: 'region',
    });

    await Project.create(project);

    await User.create(makeFakeUser({ id: userId, fullName: 'pp1', email: 'pp1@test.test' }));
    await User.create(makeFakeUser({ id: userId2, fullName: 'pp2', email: 'pp2@test.test' }));

    await ModificationRequest.create({
      id: modificationRequestId,
      projectId,
      userId,
      type: 'recours',
      requestedOn: 123,
      status: 'envoyée',
      authority: 'dgec',
    });

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
    const result = await getModificationRequestInfoForStatusNotification(
      modificationRequestId.toString(),
    );

    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;

    const DTO = result.value;

    expect(DTO).toEqual({
      nomProjet: project.nomProjet,
      departementProjet: project.departementProjet,
      regionProjet: project.regionProjet,
      type: 'recours',
      appelOffreId: project.appelOffreId,
      périodeId: project.periodeId,
      autorité: 'dgec',
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
