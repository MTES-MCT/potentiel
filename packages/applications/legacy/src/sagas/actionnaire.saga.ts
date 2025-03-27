import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { logger, ok } from '../core/utils';
import { Actionnaire } from '@potentiel-domain/laureat';
import { eventStore } from '../config/eventStore.config';
import { ProjectActionnaireUpdated } from '../modules/project';
import { getUserByEmail } from '../infra/sequelize/queries/users/getUserByEmail';
import { ModificationReceived } from '../modules/modificationRequest';
import { UniqueEntityID } from '../core/domain';
import { match } from 'ts-pattern';

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
      case 'ChangementActionnaireEnregistré-V1':
      case 'ChangementActionnaireAccordé-V1':
        const { identifiantUtilisateur, actionnaire } = match(event)
          .with({ type: 'ActionnaireModifié-V1' }, ({ payload }) => ({
            actionnaire: payload.actionnaire,
            identifiantUtilisateur: payload.modifiéPar,
          }))
          .with({ type: 'ChangementActionnaireEnregistré-V1' }, ({ payload }) => ({
            actionnaire: payload.actionnaire,
            identifiantUtilisateur: payload.enregistréPar,
          }))
          .with({ type: 'ChangementActionnaireAccordé-V1' }, ({ payload }) => ({
            actionnaire: payload.nouvelActionnaire,
            identifiantUtilisateur: payload.accordéPar,
          }))
          .exhaustive();

        const userId = await new Promise<string>((r) =>
          getUserByEmail(identifiantUtilisateur).map((user) => {
            r(user?.id ?? '');
            return ok(user);
          }),
        );

        await eventStore.publish(
          new ModificationReceived({
            payload: {
              type: 'actionnaire',
              actionnaire,
              authority: 'dreal',
              modificationRequestId: new UniqueEntityID().toString(),
              projectId: projet.id,
              requestedBy: userId,
            },
          }),
        );

        await eventStore.publish(
          new ProjectActionnaireUpdated({
            payload: {
              projectId: projet.id,
              newActionnaire: actionnaire,
              updatedBy: userId,
            },
          }),
        );

        break;
    }
  };

  mediator.register('System.Saga.Actionnaire', handler);
};
