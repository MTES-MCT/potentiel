import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Abandon } from '@potentiel-domain/laureat';
import { publishToEventBus } from '../config/eventBus.config';
import { ProjectAbandoned } from '../modules/project';
import { getLegacyIdByIdentifiantProjet } from '../infra/sequelize/queries/project/getLegacyIdByIdentifiantProjet';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { logger } from '../core/utils';

export type SubscriptionEvent = Abandon.AbandonEvent & Event;

export type Execute = Message<'EXECUTE_ABANDON_SAGA', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    switch (event.type) {
      case 'AbandonAccordé-V1':
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
              new ProjectAbandoned({
                payload: {
                  abandonAcceptedBy: accordéPar,
                  projectId,
                },
              }),
            ).map(() => {
              resolve();
            });
          });
        } else {
          logger.warning('Identifiant projet inconnu', {
            saga: 'EXECUTE_ABANDON_SAGA',
            event,
          });
        }
    }
    return Promise.reject();
  };

  mediator.register('EXECUTE_ABANDON_SAGA', handler);
};
