import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Éliminé } from '@potentiel-domain/projet';

import {
  handleRecoursDemandé,
  handleRecoursAnnulé,
  handleRecoursAccordé,
  handleRecoursRejeté,
  handleRecoursPasséEnInstruction,
} from './handlers/index.js';

export type SubscriptionEvent = Éliminé.Recours.RecoursEvent;

export type Execute = Message<'System.Notification.Eliminé.Recours', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    await match(event)
      .with({ type: 'RecoursDemandé-V1' }, handleRecoursDemandé)
      .with({ type: 'RecoursAnnulé-V1' }, handleRecoursAnnulé)
      .with({ type: 'RecoursPasséEnInstruction-V1' }, handleRecoursPasséEnInstruction)
      .with({ type: 'RecoursAccordé-V1' }, handleRecoursAccordé)
      .with({ type: 'RecoursRejeté-V1' }, handleRecoursRejeté)
      .exhaustive();
  };

  mediator.register('System.Notification.Eliminé.Recours', handler);
};
