import { logger } from '@core/utils';
import { AbandonDemandé } from '@modules/demandeModification';
import { GetProjectInfoForModificationRequestedNotification } from '@modules/modificationRequest/queries';

import { NotifierPorteurChangementStatutDemande } from '../..';

type OnAbandonDemandé = (evenement: AbandonDemandé) => Promise<void>;

type MakeOnAbandonDemandé = (dépendances: {
  getProjectInfoForModificationRequestedNotification: GetProjectInfoForModificationRequestedNotification;
  notifierPorteurChangementStatutDemande: NotifierPorteurChangementStatutDemande;
}) => OnAbandonDemandé;

export const makeOnAbandonDemandé: MakeOnAbandonDemandé =
  ({
    notifierPorteurChangementStatutDemande,
    getProjectInfoForModificationRequestedNotification,
  }) =>
  async ({ payload }: AbandonDemandé) => {
    const { demandeAbandonId, projetId } = payload;

    await getProjectInfoForModificationRequestedNotification(projetId).match(
      async ({ porteursProjet, nomProjet }) => {
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
      },
      (e: Error) => {
        logger.error(e);
      },
    );
  };
