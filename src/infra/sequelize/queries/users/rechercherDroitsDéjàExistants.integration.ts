import { User } from '@infra/sequelize/projectionsNext';
import { v4 } from 'uuid';
import { resetDatabase } from '../../helpers';
import { rechercherDroitsDéjàExistantsQueryHandler } from './rechercherDroitsDéjàExistants';

describe('Requête RechercherDroitsDéjàExistant', () => {
  beforeAll(async () => {
    // Create the tables and remove all data
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

  // it(`Étant donné un utilisateur existant et ayant des accès pour certains projets
  //     Lorsqu'on recherche si son email a déjà des droits sur plusieurs projets
  //     Alors on devrait retourner uniquement les projets pour lesquels l'utilisateur a déjà les droits
  // `, () => {});

  // it(`Étant donné un utilisateur existant et ayant des accès à tous les projets
  //     Lorsqu'on recherche si son email a déjà des droits sur plusieurs projets
  //     Alors on devrait retourner tout les projets concernés
  // `, () => {});
});
