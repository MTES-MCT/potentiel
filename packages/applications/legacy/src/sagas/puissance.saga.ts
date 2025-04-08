import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { logger, ok } from '../core/utils';
import { Puissance } from '@potentiel-domain/laureat';
import { eventStore } from '../config/eventStore.config';
import { ProjectPuissanceUpdated } from '../modules/project';
import { getUserByEmail } from '../infra/sequelize/queries/users/getUserByEmail';
import { ModificationReceived } from '../modules/modificationRequest';
import { UniqueEntityID } from '../core/domain';
import { match } from 'ts-pattern';

export type SubscriptionEvent = Puissance.PuissanceEvent & Event;

export type Execute = Message<'System.Saga.Puissance', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { payload, type } = event;

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

    const projet = await getLegacyProjetByIdentifiantProjet(identifiantProjet);

    if (!projet) {
      logger.warning('Identifiant projet inconnu', {
        saga: 'System.Saga.Puissance',
        event,
      });
      return;
    }

    switch (type) {
      case 'PuissanceModifiée-V1':
      case 'ChangementPuissanceEnregistré-V1':
      case 'ChangementPuissanceAccordé-V1':
        const { identifiantUtilisateur, puissance } = match(event)
          .with({ type: 'PuissanceModifiée-V1' }, ({ payload }) => ({
            puissance: payload.puissance,
            identifiantUtilisateur: payload.modifiéePar,
          }))
          .with({ type: 'ChangementPuissanceEnregistré-V1' }, ({ payload }) => ({
            puissance: payload.puissance,
            identifiantUtilisateur: payload.enregistréPar,
          }))
          .with({ type: 'ChangementPuissanceAccordé-V1' }, ({ payload }) => ({
            puissance: payload.nouvellePuissance,
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
              type: 'puissance',
              puissance,
              authority: 'dreal',
              modificationRequestId: new UniqueEntityID().toString(),
              projectId: projet.id,
              requestedBy: userId,
            },
          }),
        );

        await eventStore.publish(
          new ProjectPuissanceUpdated({
            payload: {
              projectId: projet.id,
              newPuissance: puissance,
              updatedBy: userId,
            },
          }),
        );

        break;
    }
  };

  mediator.register('System.Saga.Puissance', handler);
};
