import { UniqueEntityID } from '@core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { getDataForAbandonConfirméNotification } from './getDataForAbandonConfirméNotification';
import { ModificationRequest, Project, User } from '@infra/sequelize/projectionsNext';

describe('Sequelize getDataForAbandonConfirméNotification', () => {
  it('should return a complete DataForAbandonConfirméNotificationDTO', async () => {
    const projectId = new UniqueEntityID().toString();
    const modificationRequestId = new UniqueEntityID().toString();
    const userId = new UniqueEntityID().toString();
    const adminId = new UniqueEntityID().toString();

    const projectInfo = {
      id: projectId,
      nomProjet: 'nomProjet',
    };

    const project = makeFakeProject(projectInfo);
    await Project.create(project);

    await User.create(makeFakeUser({ id: adminId, fullName: 'admin1', email: 'admin1@test.test' }));
    await User.create(makeFakeUser({ id: userId }));

    await ModificationRequest.create({
      id: modificationRequestId,
      projectId,
      userId,
      type: 'abandon',
      requestedOn: 123,
      status: 'demande confirmée',
      confirmationRequestedBy: adminId,
      authority: 'dgec',
    });
    const result = await getDataForAbandonConfirméNotification(modificationRequestId.toString());

    expect(result.isOk()).toBe(true);
    if (result.isErr()) return;

    const DTO = result.value;

    expect(DTO).toEqual({
      nomProjet: 'nomProjet',
      appelOffreId: project.appelOffreId,
      périodeId: project.periodeId,
      chargeAffaire: {
        id: adminId,
        fullName: 'admin1',
        email: 'admin1@test.test',
      },
    });
  });
});
