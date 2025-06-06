import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { rebuildTriggeredProjector } from './rebuildTriggered.projector';
import { lauréatNotifiéProjector, lauréatNotifiéV1Projector } from './lauréatNotifié.projector';
import { lauréatModifiéProjector } from './lauréatModifié.projector';
import { nomEtLocalitéLauréatImportésProjector } from './nomEtLocalitéLauréatImportés.projector';
import { cahierDesChargesChoisiProjector } from './cahierDesChargesChoisi.projector';

export type SubscriptionEvent = (Lauréat.LauréatEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, rebuildTriggeredProjector)
      .with({ type: 'LauréatNotifié-V1' }, lauréatNotifiéV1Projector)
      .with({ type: 'NomEtLocalitéLauréatImportés-V1' }, nomEtLocalitéLauréatImportésProjector)
      .with({ type: 'LauréatNotifié-V2' }, lauréatNotifiéProjector)
      .with({ type: 'LauréatModifié-V1' }, lauréatModifiéProjector)
      .with({ type: 'CahierDesChargesChoisi-V1' }, cahierDesChargesChoisiProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat', handler);
};
