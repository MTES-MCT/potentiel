import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { RécupérerCandidaturesÀImporterPort } from '../port/récupérerProjetsPériode.port.js';
import type { ImportPériodeInitiéEvent } from '../période.js';
import { handleImportPériodeInitié } from './handlers/index.js';

export type SubscriptionEvent = ImportPériodeInitiéEvent;

export type Execute = Message<'System.Période.Saga.Execute', SubscriptionEvent>;

export type RegisterCandidatureSagaDependencies = {
  récupérerCandidaturesÀImporter: RécupérerCandidaturesÀImporterPort;
};

export const register = ({
  récupérerCandidaturesÀImporter,
}: RegisterCandidatureSagaDependencies) => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'ImportPériodeInitié-V1' }, (event) =>
        handleImportPériodeInitié(event, récupérerCandidaturesÀImporter),
      )
      .exhaustive();

  mediator.register('System.Période.Saga.Execute', handler);
};
