import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { logger } from '../core/utils';
import { Actionnaire } from '@potentiel-domain/laureat';
import { Project } from '../infra/sequelize/projectionsNext/project/project.model';

export type SubscriptionEvent = Actionnaire.ActionnaireEvent & Event;

export type Execute = Message<'System.Saga.Actionnaire', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { payload, type } = event;

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

    const projet = await getLegacyProjetByIdentifiantProjet(identifiantProjet);

    if (!projet) {
      logger.warning('Identifiant projet inconnu', {
        saga: 'System.Saga.Actionnaire',
        event,
      });
      return;
    }

    switch (type) {
      case 'ActionnaireModifié-V1':
      case 'ActionnaireTransmis-V1':
        const {
          payload: { actionnaire },
        } = event;
        await Project.update(
          {
            actionnaire,
          },
          {
            where: { id: projet.id },
          },
        );

        break;
    }
  };

  mediator.register('System.Saga.Actionnaire', handler);
};
