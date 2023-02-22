import { UniqueEntityID } from '@core/domain';
import { User } from '@entities';
import { USER_ROLES } from '@modules/users';
import { resetDatabase } from '../../helpers';
import { ProjectEvent } from '../../projectionsNext/projectEvents/projectEvent.model';
import { getProjectEvents } from './getProjectEvents';
import { models } from '../../models';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import {
  ProjectNotificationDateSetEvent,
  ProjectNotifiedEvent,
} from '@infra/sequelize/projectionsNext/projectEvents/events';

describe('getProjectEvents pour les événements de désignation', () => {
  const { Project } = models;
  const projetId = new UniqueEntityID().toString();
  const projet = makeFakeProject({ id: projetId, potentielIdentifier: 'pot-id' });

  // liste des événements à tester

  const projectNotifiedEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ProjectNotified',
    valueDate: new Date('2020-01-02').getTime(),
    eventPublishedAt: new Date('2020-01-02').getTime(),
  } as ProjectNotifiedEvent;

  const projectNotificationDateSetEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ProjectNotificationDateSet',
    valueDate: new Date('2020-01-03').getTime(),
    eventPublishedAt: new Date('2020-01-03').getTime(),
  } as ProjectNotificationDateSetEvent;

  beforeEach(async () => {
    await resetDatabase();
    await Project.create(projet);
  });

  const rolesAutorisés = [
    'admin',
    'porteur-projet',
    'dreal',
    'acheteur-obligé',
    'dgec-validateur',
    'cre',
    'caisse-des-dépôts',
  ];

  describe(`Utilisateurs autorisés à visualiser la date de notification`, () => {
    for (const role of rolesAutorisés) {
      it(`Etant donné une utlisateur ${role}, 
  lorsqu'il visualise la frise d'un projet, 
  alors la date de notification devrait être retournée`, async () => {
        const utilisateur = { role } as User;

        await ProjectEvent.bulkCreate([projectNotifiedEvent, projectNotificationDateSetEvent]);

        const res = await getProjectEvents({ projectId: projetId, user: utilisateur });

        expect(res._unsafeUnwrap().events).toEqual([
          {
            type: 'ProjectNotified',
            date: projectNotifiedEvent.valueDate,
            variant: utilisateur.role,
          },
          {
            type: 'ProjectNotificationDateSet',
            date: projectNotificationDateSetEvent.valueDate,
            variant: utilisateur.role,
          },
        ]);
      });
    }
  });

  describe(`Utilisateurs non-autorisés à visualiser la date de notification`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      it(`Etant donné une utlisateur ${role}, 
  lorsqu'il visualise la frise d'un projet, 
  alors la date de notification ne devrait pas être retournée`, async () => {
        const utilisateur = { role } as User;

        await ProjectEvent.bulkCreate([projectNotifiedEvent, projectNotificationDateSetEvent]);

        const res = await getProjectEvents({ projectId: projetId, user: utilisateur });

        expect(res._unsafeUnwrap().events).toEqual([]);
      });
    }
  });
});
