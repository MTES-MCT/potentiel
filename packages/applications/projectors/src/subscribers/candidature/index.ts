import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Candidature } from '@potentiel-domain/projet';

import { candidatureNotifiéeV2Projector } from './candidatureNotifiéeV2.projector.js';
import { candidatureCorrigéeProjector } from './candidatureCorrigée.projector.js';
import { candidatureNotifiéeV1Projector } from './candidatureNotifiéeV1.projector.js';
import { candidatureRebuildTriggeredProjector } from './candidatureRebuildTriggered.projector.js';
import { candidatureImportéeProjector } from './candidatureImportée.projector.js';
import { candidatureImportéeV1Projector } from './candidatureImportéeV1.projector.js';
import { candidatureCorrigéeV1Projector } from './candidatureCorrigéeV1.projector.js';
import { détailsFournisseursCandidatureImportésProjector } from './détailsFournisseursCandidatureImportés.projector.js';
import { candidatureNotifiéeV3Projector } from './candidatureNotifiéeV3.projector.js';
import { détailCandidatureImportéProjector } from './détailCandidatureImporté.projector.js';

export type SubscriptionEvent = Candidature.CandidatureEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Candidature', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, candidatureRebuildTriggeredProjector)
      .with({ type: 'CandidatureImportée-V1' }, candidatureImportéeV1Projector)
      .with({ type: 'CandidatureImportée-V2' }, candidatureImportéeProjector)
      .with({ type: 'CandidatureCorrigée-V1' }, candidatureCorrigéeV1Projector)
      .with({ type: 'CandidatureCorrigée-V2' }, candidatureCorrigéeProjector)
      .with({ type: 'CandidatureNotifiée-V1' }, candidatureNotifiéeV1Projector)
      .with({ type: 'CandidatureNotifiée-V2' }, candidatureNotifiéeV2Projector)
      .with({ type: 'CandidatureNotifiée-V3' }, candidatureNotifiéeV3Projector)
      .with(
        { type: 'DétailsFournisseursCandidatureImportés-V1' },
        détailsFournisseursCandidatureImportésProjector,
      )
      .with({ type: 'DétailCandidatureImporté-V1' }, détailCandidatureImportéProjector)
      .exhaustive();

  mediator.register('System.Projector.Candidature', handler);
};
