import { User } from '@entities';
import { UniqueEntityID } from '@core/domain';
import { USER_ROLES } from '@modules/users';
import { getProjectEvents } from '.';
import { ProjectEvent } from '../../projectionsNext';
import { resetDatabase } from '../../helpers';
import models from '../../models';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { DemandeRecoursSignaledEvent } from '@infra/sequelize/projectionsNext/projectEvents/events';

describe('getProjectEvents pour les événements DemandeRecoursSignaled', () => {
  const { Project } = models;
  const projetId = new UniqueEntityID().toString();
  const projet = makeFakeProject({ id: projetId, potentielIdentifier: 'pot-id' });

  beforeEach(async () => {
    await resetDatabase();
    await Project.create(projet);
  });

  const DemandeRecoursSignaledEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'DemandeRecoursSignaled',
    valueDate: new Date('2022-02-09').getTime(),
    eventPublishedAt: new Date('2022-02-09').getTime(),
    payload: {
      signaledBy: 'user-id',
      status: 'acceptée',
      attachment: { id: 'file-id', name: 'file-name' },
      notes: 'notes',
    },
  } as DemandeRecoursSignaledEvent;

  const rolesAutorisés = [
    'admin',
    'porteur-projet',
    'dreal',
    'acheteur-obligé',
    'dgec-validateur',
    'caisse-des-dépôts',
    'cre',
  ];

  describe(`Utilisateurs autorisés à visualiser les demandes de recours faites hors Potentiel et ajoutées aux projets`, () => {
    for (const role of rolesAutorisés) {
      const utilisateur = { role } as User;

      it(`Etant donné un utilisateur ${role},
      alors les événements DemandeRecoursSignaled devraient être retournés`, async () => {
        await ProjectEvent.create(DemandeRecoursSignaledEvent);

        const result = await getProjectEvents({ projectId: projetId, user: utilisateur });

        expect(result._unsafeUnwrap()).toMatchObject({
          events: expect.arrayContaining([
            {
              type: 'DemandeRecoursSignaled',
              variant: role,
              date: new Date('2022-02-09').getTime(),
              signaledBy: 'user-id',
              status: 'acceptée',
              ...([
                'admin',
                'dgec-validateur',
                'dreal',
                'porteur-projet',
                'cre',
                'acheteur-obligé',
              ].includes(role) && {
                attachment: { id: 'file-id', name: 'file-name' },
              }),
              ...(['admin', 'dgec-validateur', 'dreal'].includes(role) && { notes: 'notes' }),
            },
          ]),
        });
      });
    }
  });

  describe(`Utilisateurs non-autorisés à visualiser les demandes de recours faites hors Potentiel et ajoutées aux projets`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      const utilisateur = { role } as User;

      it(`Etant donné un utilisateur ${role},
      alors les événements DemandeRecoursSignaled ne devraient pas être retournés`, async () => {
        await ProjectEvent.create(DemandeRecoursSignaledEvent);

        const result = await getProjectEvents({ projectId: projetId, user: utilisateur });

        expect(result._unsafeUnwrap()).toMatchObject({
          events: expect.arrayContaining([]),
        });
      });
    }
  });
});
