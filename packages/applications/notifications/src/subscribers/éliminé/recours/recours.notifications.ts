import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import type { Éliminé } from '@potentiel-domain/projet';

import {
  handleRecoursAccordé,
  handleRecoursAnnulé,
  handleRecoursDemandé,
  handleRecoursPasséEnInstruction,
  handleRecoursRejeté,
} from './handlers/index.js';

export type SubscriptionEvent = Éliminé.Recours.RecoursEvent;

export type Execute = Message<'System.Notification.Eliminé.Recours', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    await match(event)
      .with({ type: 'RecoursDemandé-V1' }, handleRecoursDemandé)
      .with({ type: 'RecoursAnnulé-V1' }, handleRecoursAnnulé)
      .with({ type: 'RecoursPasséEnInstruction-V1' }, handleRecoursPasséEnInstruction)
      .with({ type: P.union('RecoursAccordé-V1', 'RecoursAccordé-V2') }, handleRecoursAccordé)
      .with({ type: 'RecoursRejeté-V1' }, handleRecoursRejeté)
      .exhaustive();
  };

  mediator.register('System.Notification.Eliminé.Recours', handler);
};
