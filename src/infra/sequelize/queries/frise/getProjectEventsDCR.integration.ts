import { UniqueEntityID } from '@core/domain';
import { User } from '@entities';
import { USER_ROLES } from '@modules/users';
import { resetDatabase } from '../../helpers';
import { ProjectEvent } from '../../projectionsNext/projectEvents/projectEvent.model';
import { getProjectEvents } from './getProjectEvents';
import models from '../../models';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { ProjectDCREvents } from '@infra/sequelize/projectionsNext/projectEvents/events';

describe('getProjectEvents pour les événements DCR', () => {
  const { Project } = models;
  const projetId = new UniqueEntityID().toString();
  const projet = makeFakeProject({ id: projetId, potentielIdentifier: 'pot-id' });

  //événements à tester
  const projectDCRDueDateSetEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ProjectDCRDueDateSet',
    valueDate: new Date('2022-02-01').getTime(),
    eventPublishedAt: new Date('2022-01-01').getTime(),
  } as ProjectDCREvents;

  const projectDCRSubmittedEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ProjectDCRSubmitted',
    valueDate: new Date('2022-03-01').getTime(),
    eventPublishedAt: new Date('2022-03-01').getTime(),
    payload: {
      file: { id: 'file-id', name: 'my-file-name' },
      numeroDossier: 'DOSSIER-1',
    },
  } as ProjectDCREvents;

  const projectDCRRemovedEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ProjectDCRRemoved',
    valueDate: new Date('2022-03-01').getTime(),
    eventPublishedAt: new Date('2022-03-01').getTime(),
  } as ProjectDCREvents;

  beforeEach(async () => {
    await resetDatabase();
    await Project.create(projet);
  });

  const rolesAutorisés = ['admin', 'porteur-projet', 'dreal', 'acheteur-obligé', 'dgec-validateur'];

  describe(`Utilisateur autorisé à visualiser la date limite d'envoi d'une DCR`, () => {
    for (const role of rolesAutorisés) {
      const utilisateur = { role } as User;
      it(`Etant donné un utilisateur ${role}
        alors les événements ProjectDCRDueDateSet devraient être retournés`, async () => {
        await ProjectEvent.create(projectDCRDueDateSetEvent);

        const res = await getProjectEvents({ projectId: projetId, user: utilisateur });

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ProjectDCRDueDateSet',
              date: projectDCRDueDateSetEvent.valueDate,
              variant: role,
            },
          ],
        });
      });
    }
  });

  describe(`Utilisateur non autorisé à visualiser la date limite d'envoi d'une DCR`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      const utilisateur = { role } as User;
      it(`Etant donné un utilisateur ${role}
        alors les événements ProjectDCRDueDateSet ne devraient pas être retournés`, async () => {
        await ProjectEvent.create(projectDCRDueDateSetEvent);

        const res = await getProjectEvents({ projectId: projetId, user: utilisateur });

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [],
        });
      });
    }
  });

  describe(`Utilisateur autorisé à visualiser les DCR`, () => {
    for (const role of ['admin', 'porteur-projet', 'dreal', 'dgec-validateur']) {
      const utilisateur = { role } as User;
      it(`Etant donné un utilisateur ${role}
        alors les événements ProjectDCRSubmitted et ProjectDCRRemoved devraient être retournés`, async () => {
        await ProjectEvent.bulkCreate([projectDCRSubmittedEvent, projectDCRRemovedEvent]);

        const res = await getProjectEvents({ projectId: projetId, user: utilisateur });

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ProjectDCRSubmitted',
              date: projectDCRSubmittedEvent.valueDate,
              variant: role,
              file: { id: 'file-id', name: 'my-file-name' },
              numeroDossier: 'DOSSIER-1',
            },
            {
              type: 'ProjectDCRRemoved',
              date: projectDCRRemovedEvent.valueDate,
              variant: role,
            },
          ],
        });
      });
    }
  });

  describe(`Utilisateur non autorisé à visualiser les DCR`, () => {
    for (const role of USER_ROLES.filter(
      (role) => !['admin', 'porteur-projet', 'dreal', 'dgec-validateur'].includes(role),
    )) {
      const utilisateur = { role } as User;
      it(`Etant donné un utilisateur ${role}
        alors les événements ProjectDCRSubmitted et ProjectDCRRemoved ne devraient pas être retournés`, async () => {
        await ProjectEvent.bulkCreate([projectDCRSubmittedEvent, projectDCRRemovedEvent]);

        const res = await getProjectEvents({ projectId: projetId, user: utilisateur });

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [],
        });
      });
    }
  });
});
