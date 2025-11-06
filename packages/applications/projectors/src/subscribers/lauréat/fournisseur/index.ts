import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { fournisseurImportéProjector } from './fournisseurImporté.projector';
import { fournisseurrebuildTriggeredProjector } from './fournisseurRebuildTrigerred.projector';
import { évaluationCarboneModifiéeProjector } from './évaluationCarboneModifiée.projector';
import { changementFournisseurEnregistréProjector } from './changementFournisseurEnregistré.projector';
import { fournisseurModifiéProjector } from './fournisseurModifié.projector';

export type SubscriptionEvent = Lauréat.Fournisseur.FournisseurEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Fournisseur', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, fournisseurrebuildTriggeredProjector)
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
