import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../core/domain';
import { User } from '../../../../entities';
import { USER_ROLES } from '../../../../modules/users';
import { resetDatabase } from '../../helpers';
import { ProjectEvent } from '../../projectionsNext/projectEvents/projectEvent.model';
import { getProjectEvents } from './getProjectEvents';
import { Project } from '../../projectionsNext';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { CovidDelayGrantedEvent } from '../../projectionsNext/projectEvents/events';

describe('getProjectEvents pour les événements CovidDelayGranted', () => {
  const projetId = new UniqueEntityID().toString();
  const projet = makeFakeProject({ id: projetId, potentielIdentifier: 'pot-id' });

  const covidDelayGrantedEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'CovidDelayGranted',
    valueDate: new Date('2022-01-01').getTime(),
    eventPublishedAt: new Date('2022-01-02').getTime(),
  } as CovidDelayGrantedEvent;

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
    'caisse-des-dépôts',
    'cre',
  ];

  describe(`Utilisateur ayant les droits pour visualiser le délai covid`, () => {
    for (const role of rolesAutorisés) {
      describe(`Si l'utlisateur est '${role}'`, () => {
        it(`Alors les événements CovidDelayGranted devraient être retournés`, async () => {
          const utilisateur = { role } as User;

          await ProjectEvent.create(covidDelayGrantedEvent);

          const res = await getProjectEvents({ projectId: projetId, user: utilisateur });

          expect(res._unsafeUnwrap()).toMatchObject({
            events: [
              {
                type: 'CovidDelayGranted',
                date: covidDelayGrantedEvent.valueDate,
                variant: role,
              },
            ],
          });
        });
      });
    }
  });

  describe(`Utilisateur n'ayant pas les droits`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      it(`Etant donné un utlisateur ayant le rôle '${role}',
      alors aucun événement ne devrait être retourné pour le délai covid`, async () => {
        const utilisateur = { role } as User;

        await ProjectEvent.create(covidDelayGrantedEvent);

        const res = await getProjectEvents({ projectId: projetId, user: utilisateur });

        expect(res._unsafeUnwrap()).toMatchObject({
          events: [],
        });
      });
    }
  });
});
