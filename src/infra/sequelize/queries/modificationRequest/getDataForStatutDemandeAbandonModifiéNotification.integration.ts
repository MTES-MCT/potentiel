import { describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { getDataForStatutDemandeAbandonModifiéNotification } from './getDataForStatutDemandeAbandonModifiéNotification';
import { ModificationRequest, Project, User, UserProjects } from '../../projectionsNext';

describe('Sequelize getDataForStatutDemandeAbandonModifiéNotification', () => {
  it('should return a complete DataForStatutDemandeAbandonModifiéNotification DTO', async () => {
    const projectId = new UniqueEntityID().toString();
    const modificationRequestId = new UniqueEntityID().toString();
    const userId = new UniqueEntityID().toString();
    const userId2 = new UniqueEntityID().toString();
    const adminId = new UniqueEntityID().toString();

    const project = makeFakeProject({
      id: projectId,
      nomProjet: 'nomProjet',
    });

    await Project.create(project);
    await User.create(makeFakeUser({ id: adminId, fullName: 'admin1', email: 'admin1@test.test' }));
    await User.create(
      makeFakeUser({ id: userId, fullName: 'porteur1', email: 'porteur1@test.test' }),
    );
    await User.create(
      makeFakeUser({ id: userId2, fullName: 'porteur2', email: 'porteur2@test.test' }),
    );
    await UserProjects.bulkCreate([
      { projectId, userId },
      { projectId, userId: userId2 },
    ]);

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
    const result = await getDataForStatutDemandeAbandonModifiéNotification(
      modificationRequestId.toString(),
    );

    expect(result.isOk()).toBe(true);

    if (result.isErr()) return;

    const DTO = result.value;

    expect(DTO).toEqual({
      nomProjet: 'nomProjet',
      appelOffreId: project.appelOffreId,
      périodeId: project.periodeId,
      départementProjet: project.departementProjet,
      porteursProjet: [
        { id: userId, fullName: 'porteur1', email: 'porteur1@test.test' },
        { id: userId2, fullName: 'porteur2', email: 'porteur2@test.test' },
      ],
      chargeAffaire: {
        id: adminId,
        fullName: 'admin1',
        email: 'admin1@test.test',
      },
    });
  });
});
