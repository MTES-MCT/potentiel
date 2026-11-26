import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Période } from '@potentiel-domain/periode';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { importPériodeInitiéProjector } from './importPériodeInitié.projector.js';
import { périodeImportéeProjector } from './périodeImportée.projector.js';
import { périodeNotifiéeProjector } from './périodeNotifiée.projector.js';
import { périodeRebuildTriggered } from './périodeRebuildTriggered.projector.js';

export type SubscriptionEvent = Période.PériodeEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Période', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, périodeRebuildTriggered)
      .with({ type: 'PériodeNotifiée-V1' }, périodeNotifiéeProjector)
      .with({ type: 'ImportPériodeInitié-V1' }, importPériodeInitiéProjector)
      .with({ type: 'PériodeImportée-V1' }, périodeImportéeProjector)
      .exhaustive();

  mediator.register('System.Projector.Période', handler);
};
