import { logger } from '@core/utils';
import { AbandonDemandé } from '@modules/demandeModification';
import { GetProjectInfoForModificationRequestedNotification } from '@modules/modificationRequest/queries';

import { NotificationService, NotifierPorteurChangementStatutDemande } from '../..';
import routes from '@routes';

type OnAbandonDemandé = (evenement: AbandonDemandé) => Promise<void>;

type MakeOnAbandonDemandé = (dépendances: {
  sendNotification: NotificationService['sendNotification'];
  getProjectInfoForModificationRequestedNotification: GetProjectInfoForModificationRequestedNotification;
  notifierPorteurChangementStatutDemande: NotifierPorteurChangementStatutDemande;
  dgecEmail: string;
}) => OnAbandonDemandé;

export const makeOnAbandonDemandé: MakeOnAbandonDemandé =
  ({
    notifierPorteurChangementStatutDemande,
    getProjectInfoForModificationRequestedNotification,
    sendNotification,
    dgecEmail,
  }) =>
  async ({ payload }: AbandonDemandé) => {
    const { demandeAbandonId, projetId } = payload;

    await getProjectInfoForModificationRequestedNotification(projetId).match(
      async ({ porteursProjet, nomProjet, appelOffreId, périodeId, departementProjet }) => {
        if (!porteursProjet || !porteursProjet.length) {
          // no registered user for this projet, no one to warn
          return;
        }

        await Promise.all(
          porteursProjet.map(({ email, fullName, id }) =>
            notifierPorteurChangementStatutDemande({
              email,
              fullName,
              porteurId: id,
              typeDemande: 'abandon',
              nomProjet,
              modificationRequestId: demandeAbandonId,
              status: 'envoyée',
              hasDocument: true,
            }),
          ),
        );

        await sendNotification({
          type: 'admin-modification-requested',
          message: {
            email: dgecEmail,
            name: 'DGEC',
            subject: `Potentiel - Nouvelle demande de type abandon pour un projet ${appelOffreId} période ${périodeId}`,
          },
          context: {
            modificationRequestId: demandeAbandonId,
            projectId: projetId,
            dreal: '',
            userId: '',
          },
          variables: {
            nom_projet: nomProjet,
            departement_projet: departementProjet,
            type_demande: `d'abandon`,
            modification_request_url: routes.DEMANDE_PAGE_DETAILS(demandeAbandonId),
          },
        });
      },
      (e: Error) => {
        logger.error(e);
      },
    );
  };
