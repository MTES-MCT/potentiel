import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Candidature } from '@potentiel-domain/projet';

import { candidatureNotifiéeV2Projector } from './candidatureNotifiéeV2.projector';
import { candidatureCorrigéeProjector } from './candidatureCorrigée.projector';
import { candidatureNotifiéeV1Projector } from './candidatureNotifiéeV1.projector';
import { candidatureRebuildTriggeredProjector } from './candidatureRebuildTriggered.projector';
import { candidatureImportéeProjector } from './candidatureImportée.projector';
import { candidatureImportéeV1Projector } from './candidatureImportéeV1.projector';

export type SubscriptionEvent = (Candidature.CandidatureEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Candidature', SubscriptionEvent>;

// pour le moment fournisseur ne fait pas parti de l'entity candidature
export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, candidatureRebuildTriggeredProjector)
      .with({ type: 'CandidatureImportée-V1' }, candidatureImportéeV1Projector)
      .with({ type: 'CandidatureImportée-V2' }, candidatureImportéeProjector)
      .with({ type: 'CandidatureCorrigée-V1' }, candidatureCorrigéeProjector)
      .with({ type: 'CandidatureNotifiée-V1' }, candidatureNotifiéeV1Projector)
      .with({ type: 'CandidatureNotifiée-V2' }, candidatureNotifiéeV2Projector)
      .with({ type: 'DétailsFournisseursCandidatureImportés-V1' }, () => Promise.resolve())
      .exhaustive();

  mediator.register('System.Projector.Candidature', handler);
};
