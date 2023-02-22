import { logger } from '@core/utils';
import { RejetAbandonAnnulé } from '@modules/demandeModification';
import { NotifierPorteurChangementStatutDemande } from '../..';
import { GetModificationRequestInfoForStatusNotification } from '@modules/modificationRequest/queries';

type OnAbandonAccordé = (evenement: RejetAbandonAnnulé) => Promise<void>;

type MakeOnAbandonAccordé = (dépendances: {
  getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification;
  notifierPorteurChangementStatutDemande: NotifierPorteurChangementStatutDemande;
}) => OnAbandonAccordé;

export const makeOnRejetAbandonAnnulé: MakeOnAbandonAccordé =
  ({ notifierPorteurChangementStatutDemande, getModificationRequestInfoForStatusNotification }) =>
  async ({ payload }: RejetAbandonAnnulé) => {
    const { demandeAbandonId } = payload;

    await getModificationRequestInfoForStatusNotification(demandeAbandonId).match(
      async ({ porteursProjet, nomProjet, type }) => {
        if (!porteursProjet || !porteursProjet.length) return;

        await Promise.all(
          porteursProjet.map(({ email, fullName, id }) =>
            notifierPorteurChangementStatutDemande({
              email,
              fullName,
              porteurId: id,
              typeDemande: type,
              nomProjet,
              modificationRequestId: demandeAbandonId,
              status: 'repassée en statut "envoyée"',
              hasDocument: false,
            }),
          ),
        );
      },
      (e: Error) => {
        logger.error(e);
      },
    );
  };
