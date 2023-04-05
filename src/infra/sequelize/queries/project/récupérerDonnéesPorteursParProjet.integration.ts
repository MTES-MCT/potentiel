import { User, UserProjects } from '@infra/sequelize/projectionsNext';
import * as uuid from 'uuid';
import { récupérerDonnéesPorteursParProjetQueryHandler } from './récupérerDonnéesPorteursParProjet.queryHandler';

describe('Récupérer les données des porteurs de projet pour un projet', () => {
  it(`Etant donné un projet rattaché à plusieurs utilisateur : deux porteur et une Dreal
      Lorsqu'on récupère les données des porteurs pour le projet
      Alors seulement les données des deux porteurs devtaient être retournées`, async () => {
    const projetId = uuid.v4();
    const porteur1Id = uuid.v4();
    const porteur2Id = uuid.v4();
    const drealId = uuid.v4();

    await User.bulkCreate([
      {
        id: porteur1Id,
        email: 'porteur1@test.test',
        fullName: 'porteur 1',
        role: 'porteur-projet',
      },
      {
        id: porteur2Id,
        email: 'porteur2@test.test',
        fullName: 'porteur 2',
        role: 'porteur-projet',
      },
      { id: drealId, email: 'drealtest@test.test', fullName: 'une dreal', role: 'dreal' },
    ]);

    await UserProjects.bulkCreate([
      { userId: porteur1Id, projectId: projetId },
      { userId: porteur2Id, projectId: projetId },
      { userId: drealId, projectId: projetId },
    ]);

    const readModel = await récupérerDonnéesPorteursParProjetQueryHandler({ projetId });

    expect(readModel).toHaveLength(2);

    expect(readModel).toEqual(
      expect.arrayContaining([
        {
          id: porteur1Id,
          email: 'porteur1@test.test',
          fullName: 'porteur 1',
          role: 'porteur-projet',
        },
        {
          id: porteur2Id,
          email: 'porteur2@test.test',
          fullName: 'porteur 2',
          role: 'porteur-projet',
        },
      ]),
    );
  });
});
