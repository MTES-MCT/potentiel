import { beforeEach, describe, expect, it } from '@jest/globals';
import { User } from '@entities';
import { USER_ROLES } from '@modules/users';
import { UniqueEntityID } from '@core/domain';
import { ProjectEvent } from '../../projectionsNext/projectEvents/projectEvent.model';
import { getProjectEvents } from './getProjectEvents';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { Project } from '@infra/sequelize/projectionsNext';
import { resetDatabase } from '../../helpers';

describe(`getProjectEvents`, () => {
  const projectId = new UniqueEntityID().toString();
  const projet = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' });
  const demandeEnvoyéeId = new UniqueEntityID().toString();
  const demandeAnnuléeId = new UniqueEntityID().toString();
  const demandeRejetéeId = new UniqueEntityID().toString();

  beforeEach(async () => {
    await resetDatabase();
    await Project.create(projet);
  });

  const demandeEnvoyéeÉvènement = {
    id: demandeEnvoyéeId,
    projectId,
    type: 'DemandeAnnulationAbandon',
    valueDate: new Date('2022-01-01').getTime(),
    eventPublishedAt: new Date('2022-01-01').getTime(),
    payload: {
      autorité: 'dgec',
      statut: 'envoyée',
    },
  };

  const demandeAnnuléeÉvènement = {
    id: demandeAnnuléeId,
    projectId,
    type: 'DemandeAnnulationAbandon',
    valueDate: new Date('2022-01-02').getTime(),
    eventPublishedAt: new Date('2022-01-02').getTime(),
    payload: {
      autorité: 'dgec',
      statut: 'annulée',
    },
  };

  const demandeRejetéeÉvènement = {
    id: demandeRejetéeId,
    projectId,
    type: 'DemandeAnnulationAbandon',
    valueDate: new Date('2022-01-03').getTime(),
    eventPublishedAt: new Date('2022-01-03').getTime(),
    payload: {
      autorité: 'dgec',
      statut: 'rejetée',
    },
  };

  const rolesAutorisés = [
    'admin',
    'porteur-projet',
    'dreal',
    'acheteur-obligé',
    'dgec-validateur',
    'caisse-des-dépôts',
    'cre',
  ];

  describe(`Utilisateur n'ayant pas les droits pour visualiser les demandes d'abandon`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      const user = { role } as User;
      it(`Etant donné un utilisateur '${role}',
        alors les événements de type "DemandeAnnulationAbandon" ne devraient pas être retournés`, async () => {
        await ProjectEvent.bulkCreate([
          demandeEnvoyéeÉvènement,
          demandeAnnuléeÉvènement,
          demandeRejetéeÉvènement,
        ]);

        const result = await getProjectEvents({ projectId, user });

        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        });
      });
    }
  });

  describe(`Utilisateur ayant les droits pour visualiser les demandes d'abandon`, () => {
    for (const role of rolesAutorisés) {
      const user = { role } as User;
      it(`Etant donné un utilisateur '${role}',
          alors les événements de type "DemandeAnnulationAbandon" devraient être retournés`, async () => {
        await ProjectEvent.bulkCreate([
          demandeEnvoyéeÉvènement,
          demandeAnnuléeÉvènement,
          demandeRejetéeÉvènement,
        ]);
        const result = await getProjectEvents({ projectId, user });

        expect(result._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'DemandeAnnulationAbandon',
              variant: user.role,
              date: demandeEnvoyéeÉvènement.valueDate,
              statut: 'envoyée',
            },
            {
              type: 'DemandeAnnulationAbandon',
              variant: user.role,
              date: demandeAnnuléeÉvènement.valueDate,
              statut: 'annulée',
            },
            {
              type: 'DemandeAnnulationAbandon',
              variant: user.role,
              date: demandeRejetéeÉvènement.valueDate,
              statut: 'rejetée',
            },
          ],
        });
      });
    }
  });
});
