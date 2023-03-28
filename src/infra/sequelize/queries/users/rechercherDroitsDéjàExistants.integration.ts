import { User, UserProjects } from '@infra/sequelize/projectionsNext';
import { v4 } from 'uuid';
import { resetDatabase } from '../../helpers';
import { rechercherDroitsDéjàExistantsQueryHandler } from './rechercherDroitsDéjàExistants';

describe('Requête RechercherDroitsDéjàExistant', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it(`Étant donné un utilisateur non existant
      Lorsqu'on recherche si son email a déjà des droits sur des projets
      Alors aucun projet ne devrait être retourné
  `, async () => {
    const résultat = await rechercherDroitsDéjàExistantsQueryHandler({
      email: 'utilisateurInconnu@email.com',
      projectIds: ['projet1', 'projet2'],
    });

    expect(résultat).toEqual([]);
  });

  it(`Étant donné un utilisateur existant et n'étant pas rattaché à un projet
      Lorsqu'on recherche si son email a déjà des droits sur des projets
      Alors aucun projet ne devrait être retourné
  `, async () => {
    const email = 'email@test.test';
    await User.create({
      id: v4().toString(),
      email,
      role: 'porteur-projet',
    });

    const résultat = await rechercherDroitsDéjàExistantsQueryHandler({
      email,
      projectIds: [v4().toString(), v4().toString()],
    });

    expect(résultat).toEqual([]);
  });

  it(`Étant donné un utilisateur existant et ayant des accès pour certains projets
      Lorsqu'on recherche si son email a déjà des droits sur plusieurs projets
      Alors on devrait retourner uniquement les projets pour lesquels l'utilisateur a déjà les droits
  `, async () => {
    const email = 'email@test.test';
    const projetId1 = v4().toString();
    const projetId2 = v4().toString();

    const userId = v4().toString();
    await User.create({
      id: userId,
      email,
      role: 'porteur-projet',
    });

    await UserProjects.bulkCreate([
      { userId, projectId: projetId1 },
      { userId, projectId: projetId2 },
    ]);

    const résultat = await rechercherDroitsDéjàExistantsQueryHandler({
      email,
      projectIds: [projetId1, projetId2, v4().toString()],
    });

    expect(résultat).toEqual([projetId1, projetId2]);
  });
});
