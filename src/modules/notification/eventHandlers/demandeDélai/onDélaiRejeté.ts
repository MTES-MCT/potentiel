import { logger } from '../../../../core/utils';
import { DélaiRejeté } from '../../../demandeModification';
import routes from '../../../../routes';
import { NotificationService } from '../..';
import { GetModificationRequestInfoForStatusNotification } from '../../../modificationRequest/queries/GetModificationRequestInfoForStatusNotification';

type OnDélaiRejeté = (evenement: DélaiRejeté) => Promise<void>;

type MakeOnDélaiRejeté = (dépendances: {
  sendNotification: NotificationService['sendNotification'];
  getModificationRequestInfoForStatusNotification: GetModificationRequestInfoForStatusNotification;
}) => OnDélaiRejeté;

export const makeOnDélaiRejeté: MakeOnDélaiRejeté =
  ({ sendNotification, getModificationRequestInfoForStatusNotification }) =>
  async ({ payload }: DélaiRejeté) => {
    const { demandeDélaiId } = payload;

    await getModificationRequestInfoForStatusNotification(demandeDélaiId).match(
      async ({ porteursProjet, nomProjet, type }) => {
        if (!porteursProjet || !porteursProjet.length) {
          // no registered user for this projet, no one to warn
          return;
        }

        await Promise.all(
          porteursProjet.map(({ email, fullName, id }) =>
            _sendUpdateNotification({
              email,
              fullName,
              porteurId: id,
              typeDemande: type,
              nomProjet,
              modificationRequestId: demandeDélaiId,
              status: 'rejetée',
              hasDocument: true,
            }),
          ),
        );
      },
      (e: Error) => {
        logger.error(e);
      },
    );

    function _sendUpdateNotification(args: {
      email: string;
      fullName: string;
      typeDemande: string;
      nomProjet: string;
      modificationRequestId: string;
      porteurId: string;
      status: string;
      hasDocument: boolean;
    }) {
      const {
        email,
        fullName,
        typeDemande,
        nomProjet,
        modificationRequestId,
        porteurId,
        status,
        hasDocument,
      } = args;
      return sendNotification({
        type: 'modification-request-status-update',
        message: {
          email,
          name: fullName,
          subject: `Votre demande de ${typeDemande} pour le projet ${nomProjet}`,
        },
        context: {
          modificationRequestId,
          userId: porteurId,
        },
        variables: {
          nom_projet: nomProjet,
          type_demande: typeDemande,
          status,
          modification_request_url: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
          document_absent: hasDocument ? undefined : '', // injecting an empty string will prevent the default "with document" message to be injected in the email body
        },
      });
    }
  };
