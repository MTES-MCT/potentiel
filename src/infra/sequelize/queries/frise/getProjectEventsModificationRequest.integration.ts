import { User } from '@entities';
import { UniqueEntityID } from '@core/domain';
import { USER_ROLES } from '@modules/users';
import { getProjectEvents } from '.';
import { ProjectEvent , Project } from '../../projectionsNext';
import { resetDatabase } from '../../helpers';
import makeFakeProject from '../../../../__tests__/fixtures/project';

describe('getProjectEvents pour les événements ModificationRequest*', () => {
  const projetId = new UniqueEntityID().toString();
  const modificationRequestId = new UniqueEntityID().toString();
  const projet = makeFakeProject({ id: projetId, potentielIdentifier: 'pot-id' });
  const date = new Date();

  beforeEach(async () => {
    await resetDatabase();
    await Project.create(projet);
  });

  // événements à tester

  const demandeRecoursEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ModificationRequested',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: {
      modificationType: 'recours',
      modificationRequestId,
      authority: 'dgec',
    },
  };

  const demandePuissanceEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ModificationRequested',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: {
      modificationType: 'puissance',
      modificationRequestId,
      authority: 'dgec',
      puissance: 100,
    },
  };

  const demandeAcceptéeEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ModificationRequestAccepted',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: { modificationRequestId, file: { id: 'file-id', name: 'filename' } },
  };

  const demandeRejetéeEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ModificationRequestRejected',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: { modificationRequestId, file: { id: 'file-id', name: 'filename' } },
  };

  const demandeAnnuléeEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ModificationRequestCancelled',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: { modificationRequestId },
  };

  const demandeEnInstructionEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ModificationRequestInstructionStarted',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: { modificationRequestId },
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

  describe(`Utilisateurs autorisés à visualiser les demandes de modifications`, () => {
    for (const role of rolesAutorisés) {
      const utilisateur = { role } as User;
      it(`Etant donné un utilisateur ${role}, 
      alors les demandes de modification devraient être retournées`, async () => {
        await ProjectEvent.bulkCreate([demandeRecoursEvent, demandePuissanceEvent]);

        const result = await getProjectEvents({ projectId: projetId, user: utilisateur });
        expect(result._unsafeUnwrap()).toMatchObject({
          events: expect.arrayContaining([
            {
              type: 'ModificationRequested',
              date: date.getTime(),
              variant: role,
              modificationType: 'recours',
              modificationRequestId,
              authority: 'dgec',
            },
            {
              type: 'ModificationRequested',
              date: date.getTime(),
              variant: role,
              modificationType: 'puissance',
              modificationRequestId,
              authority: 'dgec',
              puissance: 100,
              unitePuissance: 'MWc',
            },
          ]),
        });
      });

      it(`Etant donné un utilisateur ${role}, 
      alors les demandes de modification acceptées devraient être retournées`, async () => {
        await ProjectEvent.create(demandeAcceptéeEvent);

        const result = await getProjectEvents({ projectId: projetId, user: utilisateur });
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ModificationRequestAccepted',
              date: date.getTime(),
              variant: role,
              modificationRequestId,
              file: { id: 'file-id', name: 'filename' },
            },
          ],
        });
      });

      it(`Etant donné un utilisateur ${role}, 
      alors les demandes de modification rejetées devraient être retournées`, async () => {
        await ProjectEvent.create(demandeRejetéeEvent);

        const result = await getProjectEvents({ projectId: projetId, user: utilisateur });
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ModificationRequestRejected',
              date: date.getTime(),
              variant: role,
              modificationRequestId,
              file: { id: 'file-id', name: 'filename' },
            },
          ],
        });
      });

      it(`Etant donné un utilisateur ${role}, 
      alors les demandes de modification annulées devraient être retournées`, async () => {
        await ProjectEvent.create(demandeAnnuléeEvent);

        const result = await getProjectEvents({ projectId: projetId, user: utilisateur });
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ModificationRequestCancelled',
              date: date.getTime(),
              variant: role,
              modificationRequestId,
            },
          ],
        });
      });

      it(`Etant donné un utilisateur ${role}, 
      alors les demandes de modification en instruction devraient être retournées`, async () => {
        await ProjectEvent.create(demandeEnInstructionEvent);

        const result = await getProjectEvents({ projectId: projetId, user: utilisateur });
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [
            {
              type: 'ModificationRequestInstructionStarted',
              date: date.getTime(),
              variant: role,
              modificationRequestId,
            },
          ],
        });
      });
    }
  });

  describe(`Utilisateurs non-autorisés à visualiser les demandes de modifications`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      it(`Etant donné un utilisateur ${role},
      alors les demandes de modification ne devraient pas être retournées`, async () => {
        const utilisateur = { role } as User;
        await ProjectEvent.bulkCreate([
          demandeRecoursEvent,
          demandePuissanceEvent,
          demandeAcceptéeEvent,
          demandeRejetéeEvent,
          demandeAnnuléeEvent,
          demandeEnInstructionEvent,
        ]);

        const result = await getProjectEvents({ projectId: projetId, user: utilisateur });
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        });
      });
    }
  });
});
