import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import type { Éliminé } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { recoursAccordéProjector } from './recoursAccordé.projector.js';
import { recoursAnnuléProjector } from './recoursAnnulé.projector.js';
import { recoursDemandéProjector } from './recoursDemandé.projector.js';
import { recoursPasséEnInstructionProjector } from './recoursPasséEnInstruction.projector.js';
import { recoursRebuildTriggeredProjector } from './recoursRebuildTriggered.projector.js';
import { recoursRejetéProjector } from './recoursRejeté.projector.js';

export type SubscriptionEvent = Éliminé.Recours.RecoursEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Eliminé.Recours', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, recoursRebuildTriggeredProjector)
      .with({ type: 'RecoursDemandé-V1' }, recoursDemandéProjector)
      .with({ type: P.union('RecoursAccordé-V1', 'RecoursAccordé-V2') }, recoursAccordéProjector)
      .with({ type: 'RecoursRejeté-V1' }, recoursRejetéProjector)
      .with({ type: 'RecoursAnnulé-V1' }, recoursAnnuléProjector)
      .with({ type: 'RecoursPasséEnInstruction-V1' }, recoursPasséEnInstructionProjector)
      .exhaustive();

  mediator.register('System.Projector.Eliminé.Recours', handler);
};
