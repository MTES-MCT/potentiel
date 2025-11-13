import { Message, MessageHandler, mediator } from 'mediateur';
import { Éliminé } from '@potentiel-domain/projet';
import { eventStore } from '../config/eventStore.config';
import { ProjectNotified } from '../modules/project';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { logger } from '../core/utils';
import { CandidateNotifiedForPeriode } from '../modules/notificationCandidats';

export type SubscriptionEvent = Éliminé.ÉliminéNotifiéEvent;

export type Execute = Message<'System.Saga.Éliminé', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { payload, type } = event;

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);
    const projet = await getLegacyProjetByIdentifiantProjet(identifiantProjet);
    if (!projet) {
      logger.warning('Identifiant projet inconnu', {
        saga: 'System.Saga.Éliminé',
        event,
      });
      return;
    }

    switch (type) {
      case 'ÉliminéNotifié-V1':
        const basePayload = {
          appelOffreId: identifiantProjet.appelOffre,
          periodeId: identifiantProjet.période,
          candidateEmail: projet.email,
          candidateName: projet.nomRepresentantLegal,
        };
        await eventStore.publish(
          new ProjectNotified({
            payload: {
              ...basePayload,
              familleId: identifiantProjet.famille || undefined,

              notifiedOn: new Date(payload.notifiéLe).getTime(),
              projectId: projet.id,
            },
          }),
        );
        await eventStore.publish(
          new CandidateNotifiedForPeriode({
            payload: basePayload,
          }),
        );

        return;
    }
  };

  mediator.register('System.Saga.Éliminé', handler);
};
