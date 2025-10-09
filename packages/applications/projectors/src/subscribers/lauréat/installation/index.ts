import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { installationRebuilTriggeredProjector } from './installateurRebuildTrigerred.projector';
import { installationImportéeProjector } from './installationImportée.projector';
import { installateurModifiéProjector } from './installateurModifié.projector';

export type SubscriptionEvent = (Lauréat.Installation.InstallationEvent | RebuildTriggered) & Event;

export type Execute = Message<'System.Projector.Lauréat.Installation', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, installationRebuilTriggeredProjector)
      .with({ type: 'InstallationImportée-V1' }, installationImportéeProjector)
      .with({ type: 'InstallateurModifié-V1' }, installateurModifiéProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Installation', handler);
};
