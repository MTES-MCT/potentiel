import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Éliminé } from '@potentiel-domain/projet';

import { recoursDemandéProjector } from './recoursDemandé.projector.js';
import { recoursAccordéProjector } from './recoursAccordé.projector.js';
import { recoursRejetéProjector } from './recoursRejeté.projector.js';
import { recoursAnnuléProjector } from './recoursAnnulé.projector.js';
import { recoursPasséEnInstructionProjector } from './recoursPasséEnInstruction.projector.js';
import { recoursRebuildTriggeredProjector } from './recoursRebuildTriggered.projector.js';

export type SubscriptionEvent = Éliminé.Recours.RecoursEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Eliminé.Recours', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, recoursRebuildTriggeredProjector)
      .with({ type: 'RecoursDemandé-V1' }, recoursDemandéProjector)
      .with({ type: 'RecoursAccordé-V1' }, recoursAccordéProjector)
      .with({ type: 'RecoursRejeté-V1' }, recoursRejetéProjector)
      .with({ type: 'RecoursAnnulé-V1' }, recoursAnnuléProjector)
      .with({ type: 'RecoursPasséEnInstruction-V1' }, recoursPasséEnInstructionProjector)
      .exhaustive();

  mediator.register('System.Projector.Eliminé.Recours', handler);
};
