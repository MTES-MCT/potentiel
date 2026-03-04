import { mediator, Message, MessageHandler } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import {
  handleCahierDesChargesChoisi,
  handleChangementNomProjetEnregistré,
  handleLauréatNotifié,
  handleNomProjetModifié,
  handleSiteDeProductionModifié,
} from './handlers/index.js';

export type SubscriptionEvent =
  | Lauréat.CahierDesChargesChoisiEvent
  | Lauréat.ChangementNomProjetEnregistréEvent
  | Lauréat.LauréatNotifiéEvent
  | Lauréat.NomProjetModifiéEvent
  | Lauréat.SiteDeProductionModifiéEvent;

export type Execute = Message<'System.Notification.Lauréat', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    return await match(event)
      .with({ type: 'LauréatNotifié-V2' }, handleLauréatNotifié)
      .with({ type: 'CahierDesChargesChoisi-V1' }, handleCahierDesChargesChoisi)
      .with({ type: 'ChangementNomProjetEnregistré-V1' }, handleChangementNomProjetEnregistré)
      .with({ type: 'NomProjetModifié-V1' }, handleNomProjetModifié)
      .with({ type: 'SiteDeProductionModifié-V1' }, handleSiteDeProductionModifié)
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat', handler);
};
