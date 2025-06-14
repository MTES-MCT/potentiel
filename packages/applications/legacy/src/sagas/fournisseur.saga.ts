import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { logger, ok } from '../core/utils';
import { Lauréat } from '@potentiel-domain/projet';
import { eventStore } from '../config/eventStore.config';
import { ProjectDataCorrected } from '../modules/project';
import { getUserByEmail } from '../infra/sequelize/queries/users/getUserByEmail';

export type SubscriptionEvent = Lauréat.Fournisseur.FournisseurEvent & Event;

export type Execute = Message<'System.Saga.Fournisseur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { payload, type } = event;

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

    const projet = await getLegacyProjetByIdentifiantProjet(identifiantProjet);

    if (!projet) {
      logger.warning('Identifiant projet inconnu', {
        saga: 'System.Saga.Fournisseur',
        event,
      });
      return;
    }

    switch (type) {
      case 'ÉvaluationCarboneSimplifiéeModifiée-V1':
        const correctedBy = await new Promise<string>((r) =>
          getUserByEmail(payload.modifiéePar).map((user) => {
            r(user?.id ?? '');
            return ok(user);
          }),
        );

        await eventStore.publish(
          new ProjectDataCorrected({
            payload: {
              correctedBy,
              projectId: projet.id,
              correctedData: {
                evaluationCarbone: payload.évaluationCarboneSimplifiée,
              },
            },
          }),
        );

        break;
    }
  };

  mediator.register('System.Saga.Fournisseur', handler);
};
