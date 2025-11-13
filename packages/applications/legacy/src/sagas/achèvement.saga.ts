import { Message, MessageHandler, mediator } from 'mediateur';
import { ProjectCompletionDueDateSet } from '../modules/project';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { logger } from '../core/utils';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { eventStore } from '../config';
import { DateTime } from '@potentiel-domain/common';

export type SubscriptionEvent = Lauréat.Achèvement.DateAchèvementPrévisionnelCalculéeEvent;

export type Execute = Message<'System.Saga.Achèvement', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await getLegacyProjetByIdentifiantProjet(identifiantProjet);

    if (!projet) {
      logger.warning('Identifiant projet inconnu', {
        saga: 'System.Saga.Achèvement',
        event,
      });
      return;
    }

    await eventStore.publish(
      new ProjectCompletionDueDateSet({
        payload: {
          projectId: projet.id,
          completionDueOn: DateTime.convertirEnValueType(event.payload.date).date.getTime(),
        },
      }),
    );
  };

  mediator.register('System.Saga.Achèvement', handler);
};
