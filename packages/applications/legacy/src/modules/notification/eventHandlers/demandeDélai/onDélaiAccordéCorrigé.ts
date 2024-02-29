import { logger } from '../../../../core/utils';
import { DélaiAccordéCorrigé } from '../../../demandeModification';
import routes from '../../../../routes';
import { NotificationService } from '../..';
import { GetModificationRequestInfoForStatusNotification } from '../../../modificationRequest/queries/GetModificationRequestInfoForStatusNotification';

type OnDélaiAccordéCorrigé = (evenement: DélaiAccordéCorrigé) => Promise<void>;

type MakeOnDélaiAccordéCorrigé = (dépendances: {
  sendNotification: NotificationService['sendNotification'];
  getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification;
}) => OnDélaiAccordéCorrigé;

export const makeOnDélaiAccordéCorrigé: MakeOnDélaiAccordéCorrigé =
  ({ sendNotification, getModificationRequestInfoForStatusNotification }) =>
  async ({ payload }: DélaiAccordéCorrigé) => {
    const { demandeDélaiId, explications } = payload;

    await getModificationRequestInfoForStatusNotification(demandeDélaiId).match(
      async ({ porteursProjet, nomProjet, type }) => {
        if (!porteursProjet || !porteursProjet.length) {
          // no registered user for this projet, no one to warn
          return;
        }

        await Promise.all(
          porteursProjet.map(({ email, fullName, id }) =>
            sendNotification({
              type: 'pp-délai-accordé-corrigé',
              message: {
                email,
                name: fullName,
                subject: `Potentiel - Le délai accordé pour le projet ${nomProjet} a été modifié`,
              },
              context: {
                modificationRequestId: demandeDélaiId,
                userId: id,
              },
              variables: {
                nom_projet: nomProjet,
                modification_request_url: routes.GET_DETAILS_DEMANDE_DELAI_PAGE(demandeDélaiId),
                ...(explications && {
                  explications: `Explications fournies par l'administration : "${explications}".`,
                }),
              },
            }),
          ),
        );
      },
      (e: Error) => {
        logger.error(e);
      },
    );
  };
