import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import {
  handleAbandonAccordé,
  handleAbandonAnnulé,
  handleAbandonConfirmé,
  handleAbandonDemandé,
  handleAbandonPasséEnInstruction,
  handleAbandonRejeté,
  handleConfirmationAbandonDemandée,
  handlePreuveRecandidatureDemandée,
} from './handlers/index.js';

export type SubscriptionEvent = Lauréat.Abandon.AbandonEvent;

export type Execute = Message<'System.Notification.Lauréat.Abandon', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    await match(event)
      .with({ type: P.union('AbandonDemandé-V1', 'AbandonDemandé-V2') }, handleAbandonDemandé)
      .with({ type: 'AbandonAnnulé-V1' }, handleAbandonAnnulé)
      .with({ type: 'ConfirmationAbandonDemandée-V1' }, handleConfirmationAbandonDemandée)
      .with({ type: 'AbandonConfirmé-V1' }, handleAbandonConfirmé)
      .with({ type: 'AbandonAccordé-V1' }, handleAbandonAccordé)
      .with({ type: 'AbandonRejeté-V1' }, handleAbandonRejeté)
      .with({ type: 'AbandonPasséEnInstruction-V1' }, handleAbandonPasséEnInstruction)
      .with({ type: 'PreuveRecandidatureDemandée-V1' }, handlePreuveRecandidatureDemandée)
      .with({ type: 'PreuveRecandidatureTransmise-V1' }, () => Promise.resolve())
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Abandon', handler);
};
