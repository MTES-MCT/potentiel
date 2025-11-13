import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { logger, ok } from '../core/utils';
import { Lauréat } from '@potentiel-domain/projet';
import { eventStore } from '../config/eventStore.config';
import { ProjectDataCorrected, ProjectPuissanceUpdated } from '../modules/project';
import { getUserByEmail } from '../infra/sequelize/queries/users/getUserByEmail';
import { match } from 'ts-pattern';

export type SubscriptionEvent = Lauréat.Puissance.PuissanceEvent;

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
      case 'ChangementPuissanceEnregistré-V1':
      case 'ChangementPuissanceAccordé-V1':
        const { identifiantUtilisateur, puissance } = match(event)
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
          new ProjectPuissanceUpdated({
            payload: {
              projectId: projet.id,
              newPuissance: puissance,
              updatedBy: userId,
            },
          }),
        );
        break;

      case 'PuissanceModifiée-V1':
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
                puissance: payload.puissance,
              },
            },
          }),
        );

        break;
    }
  };

  mediator.register('System.Saga.Puissance', handler);
};
