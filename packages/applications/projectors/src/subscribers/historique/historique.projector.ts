import { Message, MessageHandler, mediator } from 'mediateur';

import {
  RebuildTriggered,
  Event,
  RebuildAllTriggered,
} from '@potentiel-infrastructure/pg-event-sourcing';
import {
  createHistoryProjection,
  removeHistoryProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat, Éliminé } from '@potentiel-domain/projet';

export type SubscriptionEvent =
  | (Lauréat.Abandon.AbandonEvent & Event)
  | (Éliminé.Recours.RecoursEvent & Event)
  | (Lauréat.Actionnaire.ActionnaireEvent & Event)
  | (Lauréat.ReprésentantLégal.ReprésentantLégalEvent & Event)
  | (Lauréat.Puissance.PuissanceEvent & Event)
  | (Lauréat.Producteur.ProducteurEvent & Event)
  | (Lauréat.Installation.InstallationEvent & Event)
  | (Lauréat.NatureDeLExploitation.NatureDeLExploitationEvent & Event)
  | (Lauréat.GarantiesFinancières.GarantiesFinancièresEvent & Event)
  | (Lauréat.GarantiesFinancières.GarantiesFinancièresEvent & Event)
  | (Lauréat.Raccordement.RaccordementEvent & Event)
  | (Lauréat.Achèvement.AchèvementEvent & Event)
  | (Lauréat.LauréatEvent & Event)
  | RebuildTriggered
  | RebuildAllTriggered;

export type Execute = Message<'System.Projector.Historique', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async ({ created_at, payload, stream_id, type }) => {
    if (type === 'RebuildAllTriggered') {
      const { category } = payload;
      await removeHistoryProjection(category);
    } else if (type === 'RebuildTriggered') {
      const { category, id } = payload;
      await removeHistoryProjection(category, id);
    } else {
      const [category, id] = stream_id.split('|');
      await createHistoryProjection({
        category,
        id,
        createdAt: created_at,
        payload,
        type,
      });
    }
  };

  mediator.register('System.Projector.Historique', handler);
};
