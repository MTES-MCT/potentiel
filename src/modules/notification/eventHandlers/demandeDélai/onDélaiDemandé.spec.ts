import { okAsync } from '@core/utils';
import { DélaiDemandé } from '@modules/demandeModification';
import { makeOnDélaiDemandé } from './onDélaiDemandé';
import { GetModificationRequestInfoForStatusNotification } from '@modules/modificationRequest';
import routes from '@routes';
import { User } from '@entities';

describe(`Notifier lorsqu'un délai est demandé`, () => {
  it(`Etant donné un projet sous l'autorité DGEC
      Et ayant plusieurs porteurs rattachés
      Lorsque l'un des porteurs dépose une demande de délai
      Alors tous les porteurs ayant accès au projet devraient être notifiés
      Et aucun autre acteur ne devrait être notifié`, async () => {
    const sendNotification = jest.fn();
    const getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification =
      () =>
        okAsync({
          porteursProjet: [
            { email: 'porteur1@test.test', fullName: 'Porteur de Projet 1', id: 'id-user-1' },
            { email: 'porteur2@test.test', fullName: 'Porteur de Projet 2', id: 'id-user-2' },
          ],
          nomProjet: 'nom-du-projet',
          departementProjet: 'département-du-projet',
          regionProjet: 'région-du-projet',
          type: 'type',
          evaluationCarboneDeRéférence: 100,
        });

    const onDélaiDemandé = makeOnDélaiDemandé({
      sendNotification,
      getModificationRequestInfoForStatusNotification,
      findUsersForDreal: jest.fn(),
    });

    await onDélaiDemandé(
      new DélaiDemandé({
        payload: {
          demandeDélaiId: 'la-demande',
          projetId: 'le-projet',
          porteurId: 'id-user-1',
          autorité: 'dgec',
          dateAchèvementDemandée: new Date('2022-07-12'),
        },
      }),
    );

    expect(sendNotification).toHaveBeenCalledTimes(2);
    expect(sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'modification-request-status-update',
        message: expect.objectContaining({
          email: 'porteur1@test.test',
          name: 'Porteur de Projet 1',
        }),
        context: expect.objectContaining({
          modificationRequestId: 'la-demande',
          userId: 'id-user-1',
        }),
        variables: expect.objectContaining({
          status: 'envoyée',
          nom_projet: 'nom-du-projet',
          type_demande: 'delai',
          document_absent: '',
        }),
      }),
    );

    expect(sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'modification-request-status-update',
        message: expect.objectContaining({
          email: 'porteur2@test.test',
          name: 'Porteur de Projet 2',
        }),
        context: expect.objectContaining({
          modificationRequestId: 'la-demande',
          userId: 'id-user-2',
        }),
        variables: expect.objectContaining({
          status: 'envoyée',
          nom_projet: 'nom-du-projet',
          type_demande: 'delai',
          document_absent: '',
        }),
      }),
    );
  });

  it(`Etant donné un projet sous l'autorité de deux régions
      Quand un délai est demandé
      Alors tous les agents des deux régions du projet devraient être notifiés`, async () => {
    const sendNotification = jest.fn();
    const getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification =
      () =>
        okAsync({
          porteursProjet: [
            { email: 'porteur1@test.test', fullName: 'Porteur de Projet 1', id: 'id-user-1' },
          ],
          nomProjet: 'nom-du-projet',
          departementProjet: 'département-du-projet',
          regionProjet: 'regionA / regionB',
          type: 'type',
          evaluationCarboneDeRéférence: 100,
        });

    const findUsersForDreal = (region: string) =>
      Promise.resolve(
        region === 'regionA'
          ? [{ email: 'drealA@test.test', fullName: 'drealA' } as User]
          : [
              { email: 'drealB@test.test', fullName: 'drealB' } as User,
              { email: 'drealC@test.test', fullName: 'drealC' } as User,
            ],
      );

    const onDélaiDemandé = makeOnDélaiDemandé({
      sendNotification,
      getModificationRequestInfoForStatusNotification,
      findUsersForDreal,
    });

    await onDélaiDemandé(
      new DélaiDemandé({
        payload: {
          demandeDélaiId: 'la-demande',
          projetId: 'le-projet',
          porteurId: 'id-user-1',
          autorité: 'dreal',
          dateAchèvementDemandée: new Date('2022-07-12'),
        },
      }),
    );

    expect(sendNotification).toHaveBeenCalledTimes(4);

    expect(sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'modification-request-status-update',
        message: expect.objectContaining({
          email: 'porteur1@test.test',
          name: 'Porteur de Projet 1',
        }),
        context: expect.objectContaining({
          modificationRequestId: 'la-demande',
          userId: 'id-user-1',
        }),
        variables: expect.objectContaining({
          status: 'envoyée',
          nom_projet: 'nom-du-projet',
          type_demande: 'delai',
          document_absent: '',
        }),
      }),
    );

    expect(sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'admin-modification-requested',
        message: expect.objectContaining({
          email: 'drealA@test.test',
          name: 'drealA',
        }),
        context: expect.objectContaining({
          modificationRequestId: 'la-demande',
          dreal: 'regionA',
          projectId: 'le-projet',
        }),
        variables: expect.objectContaining({
          nom_projet: 'nom-du-projet',
          modification_request_url: routes.DEMANDE_PAGE_DETAILS('la-demande'),
          type_demande: 'delai',
          departement_projet: 'département-du-projet',
        }),
      }),
    );

    expect(sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'admin-modification-requested',
        message: expect.objectContaining({
          email: 'drealB@test.test',
          name: 'drealB',
        }),
        context: expect.objectContaining({
          modificationRequestId: 'la-demande',
          dreal: 'regionB',
          projectId: 'le-projet',
        }),
        variables: expect.objectContaining({
          nom_projet: 'nom-du-projet',
          modification_request_url: routes.DEMANDE_PAGE_DETAILS('la-demande'),
          type_demande: 'delai',
          departement_projet: 'département-du-projet',
        }),
      }),
    );

    expect(sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'admin-modification-requested',
        message: expect.objectContaining({
          email: 'drealC@test.test',
          name: 'drealC',
        }),
        context: expect.objectContaining({
          modificationRequestId: 'la-demande',
          dreal: 'regionB',
          projectId: 'le-projet',
        }),
        variables: expect.objectContaining({
          nom_projet: 'nom-du-projet',
          modification_request_url: routes.DEMANDE_PAGE_DETAILS('la-demande'),
          type_demande: 'delai',
          departement_projet: 'département-du-projet',
        }),
      }),
    );
  });
});
