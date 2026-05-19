import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { changementFournisseurEnregistréProjector } from './changementFournisseurEnregistré.projector.js';
import { fournisseurImportéProjector } from './fournisseurImporté.projector.js';
import { fournisseurModifiéProjector } from './fournisseurModifié.projector.js';
import { fournisseurRebuildTriggeredProjector } from './fournisseurRebuildTrigerred.projector.js';
import { évaluationCarboneModifiéeProjector } from './évaluationCarboneModifiée.projector.js';

export type SubscriptionEvent = Lauréat.Fournisseur.FournisseurEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Fournisseur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, fournisseurRebuildTriggeredProjector)
      .with({ type: 'FournisseurImporté-V1' }, fournisseurImportéProjector)
      .with({ type: 'ÉvaluationCarboneSimplifiéeModifiée-V1' }, évaluationCarboneModifiéeProjector)
      .with(
        { type: 'ChangementFournisseurEnregistré-V1' },
        changementFournisseurEnregistréProjector,
      )
      .with({ type: 'FournisseurModifié-V1' }, fournisseurModifiéProjector)
      .exhaustive();

  mediator.register('System.Projector.Lauréat.Fournisseur', handler);
};
