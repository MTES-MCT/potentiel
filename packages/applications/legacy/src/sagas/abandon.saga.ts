import { Message, MessageHandler, mediator } from 'mediateur';
import { publishToEventBus } from '../config/eventBus.config';
import { ProjectAbandoned } from '../modules/project';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { logger } from '../core/utils';
import { Lauréat } from '@potentiel-domain/projet';

/**
 * @deprecated à bouger dans la nouvelle app
 */
export type SubscriptionEvent = Lauréat.Abandon.AbandonEvent;

/**
 * @deprecated à bouger dans la nouvelle app
 */
export type Execute = Message<'System.Saga.Abandon', SubscriptionEvent>;

/**
 * @deprecated à bouger dans la nouvelle app
 */
export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    switch (event.type) {
      case 'AbandonAccordé-V1':
        const identifiantProjet = IdentifiantProjet.convertirEnValueType(
          event.payload.identifiantProjet,
        );
        const project = await getLegacyProjetByIdentifiantProjet(identifiantProjet);
        const {
          payload: { accordéPar },
        } = event;

        if (project) {
          return new Promise<void>((resolve) => {
            publishToEventBus(
              new ProjectAbandoned({
                payload: {
                  abandonAcceptedBy: accordéPar,
                  projectId: project.id,
                },
              }),
            ).map(() => {
              resolve();
            });
          });
        } else {
          logger.warning('Identifiant projet inconnu', {
            saga: 'System.Saga.Abandon',
            event,
          });
        }
    }
    return Promise.reject();
  };

  mediator.register('System.Saga.Abandon', handler);
};
