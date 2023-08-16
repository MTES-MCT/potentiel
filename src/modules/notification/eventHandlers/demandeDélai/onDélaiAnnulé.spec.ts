import { describe, expect, it, jest } from '@jest/globals';
import { okAsync } from '../../../../core/utils';
import { User } from '../../../../entities';
import { DélaiAnnulé } from '../../../demandeModification';
import { makeOnDélaiAnnulé } from './onDélaiAnnulé';
import { GetModificationRequestInfoForStatusNotification } from '../../../modificationRequest';
import { UserRepo } from '../../../../dataAccess';

describe(`Notifier lorsqu'un délai est annulé`, () => {
  it(`Etant donné une demandé de délai sous l'autorité de la DGEC
      Quand un porteur annule la demande
      Alors tous les porteurs ayant accès au projet devraient être notifiés
      Et une notification devrait être envoyée au mail générique de la DGEC`, async () => {
    const sendNotification = jest.fn(async () => null);
    const getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification =
      () =>
        okAsync({
          porteursProjet: [
            {
              role: 'porteur-projet',
              id: 'porteur-1',
              email: 'porteur1@test.test',
              fullName: 'Porteur de projet 1',
            },
            {
              role: 'porteur-projet',
              id: 'porteur-2',
              email: 'porteur2@test.test',
              fullName: 'Porteur de projet 2',
            },
          ],
          nomProjet: 'nom-du-projet',
          regionProjet: 'region',
          departementProjet: 'departement',
          type: 'délai',
          appelOffreId: 'Eolien',
          périodeId: '1',
          autorité: 'dgec',
        });

    const onDélaiAnnulé = makeOnDélaiAnnulé({
      sendNotification,
      getModificationRequestInfoForStatusNotification,
      dgecEmail: 'dgec@email.test',
      findUsersForDreal: jest.fn<UserRepo['findUsersForDreal']>(),
    });

    await onDélaiAnnulé(
      new DélaiAnnulé({
        payload: {
          demandeDélaiId: 'la-demande',
          projetId: 'le-projet',
          annuléPar: 'le-porteur',
        },
      }),
    );

    expect(sendNotification).toHaveBeenCalledTimes(3);

    expect(sendNotification).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'modification-request-status-update',
        message: expect.objectContaining({
          email: 'porteur1@test.test',
        }),
        variables: expect.objectContaining({
          status: 'annulée',
          nom_projet: 'nom-du-projet',
          type_demande: 'délai',
        }),
      }),
    );

    expect(sendNotification).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'modification-request-status-update',
        message: expect.objectContaining({
          email: 'porteur2@test.test',
        }),
        variables: expect.objectContaining({
          status: 'annulée',
          nom_projet: 'nom-du-projet',
          type_demande: 'délai',
        }),
      }),
    );

    expect(sendNotification).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        type: 'modification-request-cancelled',
        message: expect.objectContaining({
          email: 'dgec@email.test',
          name: 'DGEC',
          subject: "Annulation d'une demande de délai (Eolien 1)",
        }),
        context: expect.objectContaining({
          modificationRequestId: 'la-demande',
        }),
        variables: expect.objectContaining({
          nom_projet: 'nom-du-projet',
          type_demande: 'délai',
          departement_projet: 'departement',
        }),
      }),
    );
  });

  it(`Etant donné une demandé de délai sous l'autorité de régions
      Quand un porteur annule la demande
      Alors tous les porteurs ayant accès au projet devraient être notifiés
      Et une notification devrait être envoyée à chaque agent DREAL rattaché aux régions du projet`, async () => {
    const sendNotification = jest.fn(async () => null);

    const getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification =
      () =>
        okAsync({
          porteursProjet: [
            {
              role: 'porteur-projet',
              id: 'porteur-1',
              email: 'porteur1@test.test',
              fullName: 'Porteur de projet 1',
            },
            {
              role: 'porteur-projet',
              id: 'porteur-2',
              email: 'porteur2@test.test',
              fullName: 'Porteur de projet 2',
            },
          ],
          nomProjet: 'nom-du-projet',
          regionProjet: 'regionA / regionB',
          departementProjet: 'departement',
          type: 'délai',
          appelOffreId: 'Sol',
          périodeId: '1',
          autorité: 'dreal',
        });

    const findUsersForDreal = (region: string) =>
      Promise.resolve(
        region === 'regionA'
          ? [{ email: 'drealA@test.test', fullName: 'drealA' } as User]
          : [{ email: 'drealB@test.test', fullName: 'drealB' } as User],
      );

    const onDélaiAnnulé = makeOnDélaiAnnulé({
      sendNotification,
      getModificationRequestInfoForStatusNotification,
      dgecEmail: 'dgec@email.test',
      findUsersForDreal,
    });

    await onDélaiAnnulé(
      new DélaiAnnulé({
        payload: {
          demandeDélaiId: 'la-demande',
          projetId: 'le-projet',
          annuléPar: 'le-porteur',
        },
      }),
    );

    expect(sendNotification).toHaveBeenCalledTimes(4);

    expect(sendNotification).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'modification-request-status-update',
        message: expect.objectContaining({
          email: 'porteur1@test.test',
        }),
        variables: expect.objectContaining({
          status: 'annulée',
          nom_projet: 'nom-du-projet',
          type_demande: 'délai',
        }),
      }),
    );

    expect(sendNotification).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'modification-request-status-update',
        message: expect.objectContaining({
          email: 'porteur2@test.test',
        }),
        variables: expect.objectContaining({
          status: 'annulée',
          nom_projet: 'nom-du-projet',
          type_demande: 'délai',
        }),
      }),
    );

    expect(sendNotification).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        type: 'modification-request-cancelled',
        message: expect.objectContaining({
          email: 'drealA@test.test',
          name: 'drealA',
        }),
        context: expect.objectContaining({
          modificationRequestId: 'la-demande',
        }),
        variables: expect.objectContaining({
          nom_projet: 'nom-du-projet',
          type_demande: 'délai',
          departement_projet: 'departement',
        }),
      }),
    );

    expect(sendNotification).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        type: 'modification-request-cancelled',
        message: expect.objectContaining({
          email: 'drealB@test.test',
          name: 'drealB',
        }),
        context: expect.objectContaining({
          modificationRequestId: 'la-demande',
        }),
        variables: expect.objectContaining({
          nom_projet: 'nom-du-projet',
          type_demande: 'délai',
          departement_projet: 'departement',
        }),
      }),
    );
  });
});
