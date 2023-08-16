import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { User } from '../../../entities';
import { ProjectCompletionDueDateSet } from '../../project';
import makeFakeProject from '../../../__tests__/fixtures/project';
import makeFakeUser from '../../../__tests__/fixtures/user';
import { makeOnProjectCompletionDueDateSet } from './onProjectCompletionDueDateSet';
import { NotificationService } from '../NotificationService';

describe(`Notification handler onProjectCompletionDueDateSet`, () => {
  const sendNotification = jest.fn<NotificationService['sendNotification']>();
  const projetId = 'projetId';
  const évènement = new ProjectCompletionDueDateSet({
    payload: {
      projectId: projetId,
      completionDueOn: new Date('2025-01-01').getTime(),
      reason: 'délaiCdc2022',
    },
  });

  beforeEach(() => {
    sendNotification.mockClear();
  });

  describe(`Notifier les porteurs de l'application du délai de 18 mois relatif au CDC 2022`, () => {
    it(`Etant donné un projet suivi par deux porteurs,
    alors les deux profils devraient être notifiés`, async () => {
      const porteur1 = makeFakeUser({
        email: 'email1@test.test',
        id: 'user-1',
        fullName: 'nom_porteur1',
      });
      const porteur2 = makeFakeUser({
        email: 'email2@test.test',
        id: 'user-2',
        fullName: 'nom_porteur2',
      });
      const onProjectCompletionDueDateSet = makeOnProjectCompletionDueDateSet({
        sendNotification,
        getProjectUsers: jest.fn(async () => [porteur1, porteur2]),
        getProjectById: jest.fn(async () =>
          makeFakeProject({ id: projetId, nomProjet: 'nom_projet' }),
        ),
        findUsersForDreal: jest.fn(async () => []),
      });

      await onProjectCompletionDueDateSet(évènement);

      expect(sendNotification).toHaveBeenCalledTimes(2);

      expect(sendNotification).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: 'pp-delai-cdc-2022-appliqué',
          context: expect.objectContaining({ projetId, utilisateurId: 'user-1' }),
          variables: expect.objectContaining({
            nom_projet: 'nom_projet',
            projet_url: expect.anything(),
          }),
          message: expect.objectContaining({
            email: 'email1@test.test',
            name: 'nom_porteur1',
            subject: `Potentiel - Nouveau délai appliqué pour votre projet nom_projet`,
          }),
        }),
      );

      expect(sendNotification).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: 'pp-delai-cdc-2022-appliqué',
          context: expect.objectContaining({ projetId, utilisateurId: 'user-2' }),
          variables: expect.objectContaining({
            nom_projet: 'nom_projet',
            projet_url: expect.anything(),
          }),
          message: expect.objectContaining({
            email: 'email2@test.test',
            name: 'nom_porteur2',
            subject: `Potentiel - Nouveau délai appliqué pour votre projet nom_projet`,
          }),
        }),
      );
    });
  });

  describe(`Notifier les Dreals concernées 
  de l'application du délai de 18 mois relatif au CDC 2022`, () => {
    it(`Etant donné un projet suivi par deux Dreals,
    alors les deux profils devraient être notifiés`, async () => {
      const onProjectCompletionDueDateSet = makeOnProjectCompletionDueDateSet({
        sendNotification,
        getProjectUsers: jest.fn(async () => []),
        getProjectById: jest.fn(async () =>
          makeFakeProject({
            id: projetId,
            nomProjet: 'nom_projet',
            regionProjet: 'regionA / regionB',
          }),
        ),
        findUsersForDreal: (region: string) =>
          Promise.resolve(
            region === 'regionA'
              ? [{ email: 'drealA@test.test', fullName: 'drealA', id: 'user-A' } as User]
              : [{ email: 'drealB@test.test', fullName: 'drealB', id: 'user-B' } as User],
          ),
      });
      await onProjectCompletionDueDateSet(évènement);

      expect(sendNotification).toHaveBeenCalledTimes(2);

      expect(sendNotification).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: 'dreals-delai-cdc-2022-appliqué',
          context: expect.objectContaining({ projetId, utilisateurId: 'user-A' }),
          variables: expect.objectContaining({
            nom_projet: 'nom_projet',
            projet_url: expect.anything(),
          }),
          message: expect.objectContaining({
            email: 'drealA@test.test',
            name: 'drealA',
            subject: `Potentiel - Nouveau délai appliqué pour le projet nom_projet`,
          }),
        }),
      );

      expect(sendNotification).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: 'dreals-delai-cdc-2022-appliqué',
          context: expect.objectContaining({ projetId, utilisateurId: 'user-B' }),
          variables: expect.objectContaining({
            nom_projet: 'nom_projet',
            projet_url: expect.anything(),
          }),
          message: expect.objectContaining({
            email: 'drealB@test.test',
            name: 'drealB',
            subject: `Potentiel - Nouveau délai appliqué pour le projet nom_projet`,
          }),
        }),
      );
    });
  });
});
