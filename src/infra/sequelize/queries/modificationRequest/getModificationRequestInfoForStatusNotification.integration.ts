import { UniqueEntityID } from '@core/domain';
import { resetDatabase } from '../../helpers';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { getModificationRequestInfoForStatusNotification } from './getModificationRequestInfoForStatusNotification';
import { ModificationRequest, Project, User, UserProjects } from '@infra/sequelize/projectionsNext';

describe('Sequelize getModificationRequestInfoForStatusNotification', () => {
  const projectId = new UniqueEntityID().toString();
  const modificationRequestId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();
  const userId2 = new UniqueEntityID().toString();

  const projectInfo = {
    id: projectId,
    nomProjet: 'nomProjet',
    departementProjet: 'departement',
    regionProjet: 'region',
  };

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();

    await Project.create(makeFakeProject(projectInfo));

    await User.create(makeFakeUser({ id: userId, fullName: 'pp1', email: 'pp1@test.test' }));
    await User.create(makeFakeUser({ id: userId2, fullName: 'pp2', email: 'pp2@test.test' }));

    await ModificationRequest.create({
      id: modificationRequestId,
      projectId,
      userId,
      type: 'recours',
      requestedOn: 123,
      status: 'envoyée',
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
  });

  it('should return a complete ModificationRequestUpdateInfoDTO', async () => {
    const modificationRequestResult = await getModificationRequestInfoForStatusNotification(
      modificationRequestId.toString(),
    );

    expect(modificationRequestResult.isOk()).toBe(true);
    if (modificationRequestResult.isErr()) return;

    const modificationRequestDTO = modificationRequestResult.value;

    expect(modificationRequestDTO).toEqual({
      nomProjet: 'nomProjet',
      departementProjet: 'departement',
      regionProjet: 'region',
      type: 'recours',
      porteursProjet: [
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
      ],
    });
  });
});
