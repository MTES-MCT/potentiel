import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { fournisseurImportéProjector } from './fournisseurImporté.projector';
import { fournisseurRebuilTriggeredProjector } from './fournisseurRebuildTrigerred.projector';
import { évaluationCarboneModifiéeProjector } from './évaluationCarboneModifiée.projector';
import { changementFournisseurEnregistréProjector } from './changementFournisseurEnregistré.projector';

export type SubscriptionEvent = (Lauréat.Fournisseur.FournisseurEvent | RebuildTriggered) & Event;

export type Execute = Message<'System.Projector.Lauréat.Fournisseur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, fournisseurRebuilTriggeredProjector)
      .with({ type: 'FournisseurImporté-V1' }, fournisseurImportéProjector)
      .with({ type: 'ÉvaluationCarboneSimplifiéeModifiée-V1' }, évaluationCarboneModifiéeProjector)
      .with(
        { type: 'ChangementFournisseurEnregistré-V1' },
        changementFournisseurEnregistréProjector,
      )
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Fournisseur', handler);
};
