import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { SendEmail } from '../../../sendEmail';
import { getLauréat } from '../../../_helpers';

import {
  handleChangementFournisseurEnregistré,
  handleFournisseurModifié,
  handleÉvaluationCarboneSimplifiéeModifiée,
} from './handlers';

export type SubscriptionEvent = Lauréat.Fournisseur.FournisseurEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.Fournisseur', SubscriptionEvent>;

export type RegisterFournisseurNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterFournisseurNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await getLauréat(identifiantProjet.formatter());

    return match(event)
      .with({ type: 'ÉvaluationCarboneSimplifiéeModifiée-V1' }, async (event) =>
        handleÉvaluationCarboneSimplifiéeModifiée({ sendEmail, event, projet }),
      )
      .with({ type: 'ChangementFournisseurEnregistré-V1' }, async (event) =>
        handleChangementFournisseurEnregistré({ sendEmail, event, projet }),
      )
      .with({ type: 'FournisseurModifié-V1' }, async (event) =>
        handleFournisseurModifié({ sendEmail, event, projet }),
      )
      .with(
        {
          type: P.union('FournisseurImporté-V1'),
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Fournisseur', handler);
};
