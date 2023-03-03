import { User } from '@entities';
import { UniqueEntityID } from '@core/domain';
import { USER_ROLES } from '@modules/users';
import { getProjectEvents } from '.';
import { ProjectEvent , Project } from '../../projectionsNext';
import { resetDatabase } from '../../helpers';
import makeFakeProject from '../../../../__tests__/fixtures/project';

describe('getProjectEvents pour les événements LegacyModificationImported', () => {
  const projectId = new UniqueEntityID().toString();
  const fakeProject = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' });
  const date = new Date();

  // événements à tester

  const legacyDelayModificationImportedEvent = {
    id: new UniqueEntityID().toString(),
    projectId,
    type: 'LegacyModificationImported',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: {
      modificationType: 'delai',
      status: 'acceptée',
      ancienneDateLimiteAchevement: new Date('2022-01-01').getTime(),
      nouvelleDateLimiteAchevement: new Date('2024-01-01').getTime(),
    },
  };

  const legacyAbandonModificationImportedEvent = {
    id: new UniqueEntityID().toString(),
    projectId,
    type: 'LegacyModificationImported',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: {
      modificationType: 'abandon',
      status: 'acceptée',
    },
  };

  const legacyRecoursModificationImportedEvent = {
    id: new UniqueEntityID().toString(),
    projectId,
    type: 'LegacyModificationImported',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: {
      modificationType: 'recours',
      status: 'acceptée',
      motifElimination: 'motif',
    },
  };

  const legacyActionnaireModificationImportedEvent = {
    id: new UniqueEntityID().toString(),
    projectId,
    type: 'LegacyModificationImported',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: {
      modificationType: 'actionnaire',
      actionnairePrecedent: 'nom actionnaire précédent',
      status: 'acceptée',
    },
  };

  const legacyProducteurModificationImportedEvent = {
    id: new UniqueEntityID().toString(),
    projectId,
    type: 'LegacyModificationImported',
    valueDate: date.getTime(),
    eventPublishedAt: date.getTime(),
    payload: {
      modificationType: 'producteur',
      producteurPrecedent: 'nom producteur précédent',
      status: 'acceptée',
    },
  };

  beforeEach(async () => {
    await resetDatabase();
    await Project.create(fakeProject);
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

  describe(`Utilisateurs autorisés`, () => {
    for (const role of USER_ROLES.filter((role) => rolesAutorisés.includes(role))) {
      it(`Etant donné un utlisateur '${role}',
        alors les modifications historiques devraient être retournées`, async () => {
        const utilisateur = { role } as User;

        await ProjectEvent.bulkCreate([
          legacyDelayModificationImportedEvent,
          legacyAbandonModificationImportedEvent,
          legacyRecoursModificationImportedEvent,
          legacyActionnaireModificationImportedEvent,
          legacyProducteurModificationImportedEvent,
        ]);

        const result = await getProjectEvents({ projectId, user: utilisateur });
        expect(result._unsafeUnwrap().events).toHaveLength(5);
        expect(result._unsafeUnwrap()).toMatchObject({
          events: expect.arrayContaining([
            {
              type: 'LegacyModificationImported',
              date: date.getTime(),
              variant: role,
              modificationType: 'delai',
              status: 'acceptée',
              ancienneDateLimiteAchevement:
                legacyDelayModificationImportedEvent.payload.ancienneDateLimiteAchevement,
              nouvelleDateLimiteAchevement:
                legacyDelayModificationImportedEvent.payload.nouvelleDateLimiteAchevement,
            },
            {
              type: 'LegacyModificationImported',
              date: date.getTime(),
              variant: role,
              modificationType: 'abandon',
              status: 'acceptée',
            },
            {
              type: 'LegacyModificationImported',
              date: date.getTime(),
              variant: role,
              modificationType: 'recours',
              status: 'acceptée',
              motifElimination: 'motif',
            },
            {
              type: 'LegacyModificationImported',
              date: date.getTime(),
              variant: role,
              modificationType: 'actionnaire',
              actionnairePrecedent: 'nom actionnaire précédent',
              status: 'acceptée',
            },
            {
              type: 'LegacyModificationImported',
              date: date.getTime(),
              variant: role,
              modificationType: 'producteur',
              producteurPrecedent: 'nom producteur précédent',
              status: 'acceptée',
            },
          ]),
        });
      });
    }
  });
  describe(`Utilisateurs non-autorisés`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      it(`Etant donné un utlisateur '${role}',
        alors les modifications historiques ne devraient pas être retournées`, async () => {
        const utilisateur = { role } as User;

        await ProjectEvent.bulkCreate([
          legacyDelayModificationImportedEvent,
          legacyAbandonModificationImportedEvent,
          legacyRecoursModificationImportedEvent,
          legacyActionnaireModificationImportedEvent,
          legacyProducteurModificationImportedEvent,
        ]);

        const result = await getProjectEvents({ projectId, user: utilisateur });
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        });
      });
    }
  });
});
