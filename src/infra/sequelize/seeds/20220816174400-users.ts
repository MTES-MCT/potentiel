import { QueryInterface } from 'sequelize';
import { v4 } from 'uuid';

const drealUserId = '5c3c3cd0-95f1-11ea-b350-bb5aa5faa992';
const users = [
  {
    id: drealUserId,
    fullName: 'Dreal Test',
    email: 'dreal@test.test',
    role: 'dreal',
  },
  {
    id: '5c3bc7a0-95f1-11ea-b350-bb5aa5faa993',
    fullName: 'Admin Test',
    email: 'admin@test.test',
    role: 'admin',
  },
  {
    id: '5c3c3cd4-95f1-11ea-b350-bb5aa5faa994',
    fullName: 'Porteur Projet Test',
    email: 'porteur@test.test',
    role: 'porteur-projet',
  },
  {
    id: '5c3c3cd4-95f1-11ea-b350-bb5aa5faa995',
    fullName: 'Ademe Test',
    email: 'ademe@test.test',
    role: 'ademe',
  },
  {
    id: '5c3c3cd4-95f1-11ea-b350-bb5aa5faa996',
    fullName: 'Acheteur obligé Test',
    email: 'ao@test.test',
    role: 'acheteur-obligé',
  },
  {
    id: '5c3c3cd4-95f1-11ea-b350-bb5aa5faa997',
    fullName: 'DGEC validateur Test',
    email: 'dgec-validateur@test.test',
    fonction: 'Intitulé de la fonction du DGEC validateur test',
    role: 'dgec-validateur',
  },
  {
    id: '5c3c3cd4-95f1-11ea-b350-bb5aa5faa998',
    fullName: 'CRE',
    email: 'cre@test.test',
    fonction: 'Intitulé de la fonction du CRE',
    role: 'cre',
  },
  {
    id: '5c3c3cd4-95f1-11ea-b350-bb5aa5faa999',
    fullName: 'Caisse des dépôts test',
    email: 'caissedesdepots@test.test',
    role: 'caisse-des-dépôts',
  },
];

export default {
  up: async (queryInterface: QueryInterface) => {
    for (const user of users) {
      const search = await queryInterface.rawSelect(
        'users',
        {
          where: {
            id: user.id,
          },
        },
        ['id'],
      );

      const u = !search ? undefined : search[0];

      if (!u) {
        console.log(`Seed: Create ${user.email}`);
        await queryInterface.bulkInsert(
          'users',
          [
            {
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              role: user.role,
              createdAt: new Date(),
              updatedAt: new Date(),
              fonction: user.fonction,
            },
          ],
          {},
        );

        await queryInterface.bulkInsert('eventStores', [
          {
            id: v4(),
            type: 'UserCreated',
            payload: JSON.stringify({
              userId: user.id,
              email: user.email,
              role: user.role,
              fullName: user.fullName,
            }),
            version: 1,
            aggregateId: [user.id],
            occurredAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);

        if (user.id === drealUserId) {
          console.log(`Seed: Add Dreal ${user.email} to Ile-de-France`);
          await queryInterface.bulkInsert('userDreals', [
            {
              userId: drealUserId,
              dreal: 'Île-de-France',
            },
          ]);
        }
      } else {
        console.log(`Seed: ${user.email} already exists`);
      }
    }
  },
};
