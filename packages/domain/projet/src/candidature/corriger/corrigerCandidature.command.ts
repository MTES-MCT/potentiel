import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';
import { ImporterCandidatureCommand } from '../importer/importerCandidature.command';

export type CorrigerCandidatureCommand = Message<
  'Candidature.Command.CorrigerCandidature',
  Omit<ImporterCandidatureCommand['data'], 'importéLe' | 'importéPar'> & {
    corrigéLe: DateTime.ValueType;
    corrigéPar: Email.ValueType;
    doitRégénérerAttestation?: true;
    détailsMisÀJour?: true;
  }
>;

export const registerCorrigerCandidatureCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<CorrigerCandidatureCommand> = async (message) => {
    const projet = await getProjetAggregateRoot(message.identifiantProjet);
    return projet.candidature.corriger(message);
  };

  mediator.register('Candidature.Command.CorrigerCandidature', handler);
};
