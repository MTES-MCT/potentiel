import { describe, expect, it, jest } from '@jest/globals';
import { okAsync } from '../../../../core/utils';
import { AbandonDemandé } from "../../../demandeModification";
import { makeOnAbandonDemandé } from '.';
import { GetProjectInfoForModificationRequestedNotification } from "../../../modificationRequest/queries";
import { NotificationService } from '../../NotificationService';
import { NotifierPorteurChangementStatutDemande } from "../..";

describe(`Notifier lorsqu'un abandon est demandé`, () => {
  it(`Etant donné un projet accessible pour deux porteurs
      Quand un abandon est demandé
      Alors les deux porteurs ayant accès au projet devraient être notifiés
      Et une notification devrait être envoyée sur l'email générique de la DGEC avec l'AO en objet`, async () => {
    const sendNotification = jest.fn<NotificationService['sendNotification']>();
    const notifierPorteurChangementStatutDemande =
      jest.fn<NotifierPorteurChangementStatutDemande>();
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
          departementProjet: 'département-du-projet',
          type: 'abandon',
          appelOffreId: 'Eolien',
          périodeId: '1',
        });

    const onAbandonDemandé = makeOnAbandonDemandé({
      notifierPorteurChangementStatutDemande,
      getProjectInfoForModificationRequestedNotification,
      sendNotification,
      dgecEmail: 'dgec@test.test',
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

    expect(sendNotification).toHaveBeenCalledTimes(1);

    expect(sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'admin-modification-requested',
        message: expect.objectContaining({
          email: 'dgec@test.test',
          name: 'DGEC',
          subject: `Potentiel - Nouvelle demande de type abandon pour un projet Eolien période 1`,
        }),
        context: expect.objectContaining({
          modificationRequestId: 'la-demande',
          projectId: 'le-projet',
        }),
        variables: expect.objectContaining({
          nom_projet: 'nom-du-projet',
          modification_request_url: '/demande/la-demande/details.html',
          type_demande: `abandon`,
          departement_projet: 'département-du-projet',
        }),
      }),
    );
  });
});
