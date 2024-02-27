import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Recours } from '@potentiel-domain/elimine';
import { publishToEventBus } from '../config/eventBus.config';
import { ProjectCertificateUpdated, ProjectClasseGranted } from '../modules/project';
import { getLegacyIdByIdentifiantProjet } from '../infra/sequelize/queries/project/getLegacyIdByIdentifiantProjet';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { logger } from '../core/utils';

/**
 * @deprecated à bouger dans la nouvelle app
 */
export type SubscriptionEvent = Recours.RecoursEvent & Event;

/**
 * @deprecated à bouger dans la nouvelle app
 */
export type Execute = Message<'EXECUTE_RECOURS_SAGA', SubscriptionEvent>;

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

        if (projectId) {
          return new Promise<void>((resolve) => {
            publishToEventBus(
              new ProjectClasseGranted({
                payload: {
                  grantedBy: accordéPar,
                  projectId,
                },
              }),
            ).map(() => {
              publishToEventBus(
                new ProjectCertificateUpdated({
                  payload: {
                    projectId,
                    certificateFileId,
                    uploadedBy: accordéPar,
                  },
                }),
              ).map(() => {
                resolve();
              });
            });
          });
        } else {
          logger.warning('Identifiant projet inconnu', {
            saga: 'EXECUTE_RECOURS_SAGA',
            event,
          });
        }
    }
    return Promise.reject();
  };

  mediator.register('EXECUTE_RECOURS_SAGA', handler);
};
