import { okAsync } from '@core/utils';
import { AbandonDemandé } from '@modules/demandeModification';
import { makeOnAbandonDemandé } from '.';
import { GetProjectInfoForModificationRequestedNotification } from '@modules/modificationRequest/queries';

describe(`Notifier lorsqu'un abandon est demandé`, () => {
  it(`Etant donné un projet accessible pour deux porteurs
      Quand un abandon est demandé
      Alors les deux porteurs ayant accès au projet devraient être notifiés`, async () => {
    const notifierPorteurChangementStatutDemande = jest.fn();
    const getProjectInfoForModificationRequestedNotification: GetProjectInfoForModificationRequestedNotification =
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
          type: 'abandon',
        });

    const onAbandonDemandé = makeOnAbandonDemandé({
      notifierPorteurChangementStatutDemande,
      getProjectInfoForModificationRequestedNotification,
    });

    await onAbandonDemandé(
      new AbandonDemandé({
        payload: {
          demandeAbandonId: 'la-demande',
          projetId: 'le-projet',
          porteurId: 'le-porteur',
          autorité: 'dgec',
        },
      }),
    );

    expect(notifierPorteurChangementStatutDemande).toHaveBeenCalledTimes(2);
    expect(notifierPorteurChangementStatutDemande).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        email: 'porteur1@test.test',
        status: 'envoyée',
        fullName: 'Porteur de projet 1',
        porteurId: 'porteur-1',
        typeDemande: 'abandon',
        nomProjet: 'nom-du-projet',
        modificationRequestId: 'la-demande',
        hasDocument: true,
      }),
    );

    expect(notifierPorteurChangementStatutDemande).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        email: 'porteur2@test.test',
        status: 'envoyée',
        fullName: 'Porteur de projet 2',
        porteurId: 'porteur-2',
        typeDemande: 'abandon',
        nomProjet: 'nom-du-projet',
        modificationRequestId: 'la-demande',
        hasDocument: true,
      }),
    );
  });
});
