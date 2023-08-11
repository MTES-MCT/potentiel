import { describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import { User } from '@entities';
import { USER_ROLES } from '@modules/users';
import { resetDatabase } from '../../helpers';
import { ProjectEvent } from '../../projectionsNext/projectEvents/projectEvent.model';
import { getProjectEvents } from './getProjectEvents';
import { Project } from '@infra/sequelize/projectionsNext';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { ProjectImportedEvent } from '@infra/sequelize/projectionsNext/projectEvents/events';

describe('getProjectEvents pour les événements de désignation', () => {
  const projetId = new UniqueEntityID().toString();
  const projet = makeFakeProject({ id: projetId, potentielIdentifier: 'pot-id' });

  const projectImportedEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ProjectImported',
    valueDate: new Date('2020-01-01').getTime(),
    eventPublishedAt: new Date('2020-01-01').getTime(),
    payload: {
      notifiedOn: 0,
    },
  } as ProjectImportedEvent;

  beforeEach(async () => {
    await resetDatabase();
    await Project.create(projet);
  });

  const rolesAutorisés = ['admin', 'dgec-validateur'];

  describe(`Utilisateurs autorisés à visualiser les données de désignation`, () => {
    for (const role of rolesAutorisés) {
      it(`Etant donné une utlisateur ${role}, 
  lorsqu'il visualise la frise d'un projet, 
  alors les événements de désignation devraient être retournés`, async () => {
        const utilisateur = { role } as User;

        await ProjectEvent.create(projectImportedEvent);

        const res = await getProjectEvents({ projectId: projetId, user: utilisateur });

        expect(res._unsafeUnwrap().events).toEqual([
          {
            type: 'ProjectImported',
            date: projectImportedEvent.valueDate,
            variant: utilisateur.role,
          },
        ]);
      });
    }
  });

  describe(`Utilisateurs non-autorisés à visualiser les données de désignation`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      it(`Etant donné une utlisateur ${role}, 
  lorsqu'il visualise la frise d'un projet, 
  alors les événements de désignation ne devraient pas être retournés`, async () => {
        const utilisateur = { role } as User;

        await ProjectEvent.create(projectImportedEvent);

        const res = await getProjectEvents({ projectId: projetId, user: utilisateur });

        expect(res._unsafeUnwrap().events).toEqual([]);
      });
    }
  });
});
