import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Recours } from '@potentiel-domain/elimine';
import { getLegacyIdByIdentifiantProjet } from '../infra/sequelize/queries/project/getLegacyIdByIdentifiantProjet';
import { IdentifiantProjet } from '@potentiel-domain/common';

/**
 * @deprecated à bouger dans la nouvelle app
 */
export type SubscriptionEvent = Recours.RecoursEvent & Event;

/**
 * @deprecated à bouger dans la nouvelle app
 */
export type Execute = Message<'System.Saga.Recours', SubscriptionEvent>;

/**
 * @deprecated à bouger dans la nouvelle app
 */
export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    switch (event.type) {
      case 'RecoursAccordé-V1':
        const identifiantProjet = IdentifiantProjet.convertirEnValueType(
          event.payload.identifiantProjet,
        );
        const projectId = await getLegacyIdByIdentifiantProjet(identifiantProjet);
        const {
          payload: { accordéPar },
        } = event;

      // if (projectId) {
      //   return new Promise<void>((resolve) => {
      //     publishToEventBus(
      //       new ProjectClasseGranted({
      //         payload: {
      //           grantedBy: accordéPar,
      //           projectId,
      //         },
      //       }),
      //     ).map(() => {
      //       publishToEventBus(
      //         new ProjectCertificateGenerated({
      //           payload: {
      //             projectId,
      //             certificateFileId, // Problème ici car on ne stocke pas le fichier de réponse dans la table `File`. Il faudrait générer l'attestation de désignation après un recours
      //             // uploadedBy: accordéPar,
      //           },
      //         }),
      //       ).map(() => {
      //         resolve();
      //       });
      //     });
      //   });
      // } else {
      //   logger.warning('Identifiant projet inconnu', {
      //     saga: 'System.Saga.Recours',
      //     event,
      //   });
      // }
    }
    return Promise.reject();
  };

  mediator.register('System.Saga.Recours', handler);
};
