import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { logger, ok } from '../core/utils';
import { Lauréat } from '@potentiel-domain/projet';
import { eventStore } from '../config/eventStore.config';
import { ProjectDataCorrected, ProjectProducteurUpdated } from '../modules/project';
import { getUserByEmail } from '../infra/sequelize/queries/users/getUserByEmail';

export type SubscriptionEvent = Lauréat.Producteur.ProducteurEvent;

export type Execute = Message<'System.Saga.Producteur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { payload, type } = event;

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

    const projet = await getLegacyProjetByIdentifiantProjet(identifiantProjet);

    if (!projet) {
      logger.warning('Identifiant projet inconnu', {
        saga: 'System.Saga.Producteur',
        event,
      });
      return;
    }

    switch (type) {
      case 'ChangementProducteurEnregistré-V1':
        const updatedBy = await new Promise<string>((r) =>
          getUserByEmail(payload.enregistréPar).map((user) => {
            r(user?.id ?? '');
            return ok(user);
          }),
        );
        const { producteur } = payload;

        await eventStore.publish(
          new ProjectProducteurUpdated({
            payload: {
              projectId: projet.id,
              newProducteur: producteur,
              updatedBy: updatedBy,
            },
          }),
        );
        break;

      case 'ProducteurModifié-V1':
        const correctedBy = await new Promise<string>((r) =>
          getUserByEmail(payload.modifiéPar).map((user) => {
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
                nomCandidat: payload.producteur,
              },
            },
          }),
        );

        break;
    }
  };

  mediator.register('System.Saga.Producteur', handler);
};
