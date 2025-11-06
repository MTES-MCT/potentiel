import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { lauréatRebuildTriggeredProjector } from './lauréatRebuildTriggered.projector';
import { lauréatNotifiéProjector, lauréatNotifiéV1Projector } from './lauréatNotifié.projector';
import { siteDeProductionModifiéProjector } from './siteDeProductionModifié.projector';
import { nomEtLocalitéLauréatImportésProjector } from './nomEtLocalitéLauréatImportés.projector';
import { cahierDesChargesChoisiProjector } from './cahierDesChargesChoisi.projector';
import { nomProjetModifiéProjector } from './nomProjetModifié.projector';
import { changementNomProjetEnregistréProjector } from './changementNomProjetEnregistré.projector';

export type SubscriptionEvent = Lauréat.LauréatEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, lauréatRebuildTriggeredProjector)
      .with({ type: 'LauréatNotifié-V1' }, lauréatNotifiéV1Projector)
      .with({ type: 'NomEtLocalitéLauréatImportés-V1' }, nomEtLocalitéLauréatImportésProjector)
      .with({ type: 'LauréatNotifié-V2' }, lauréatNotifiéProjector)
      .with({ type: 'NomProjetModifié-V1' }, nomProjetModifiéProjector)
      .with({ type: 'SiteDeProductionModifié-V1' }, siteDeProductionModifiéProjector)
      .with({ type: 'CahierDesChargesChoisi-V1' }, cahierDesChargesChoisiProjector)
      .with({ type: 'ChangementNomProjetEnregistré-V1' }, changementNomProjetEnregistréProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat', handler);
};
