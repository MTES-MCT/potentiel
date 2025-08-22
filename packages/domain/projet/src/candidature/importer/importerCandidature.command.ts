import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../..';
import type { Dépôt, Instruction } from '..';

export type ImporterCandidatureCommand = Message<
  'Candidature.Command.ImporterCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dépôt: Dépôt.ValueType;
    instruction: Instruction.ValueType;
    importéLe: DateTime.ValueType;
    importéPar: Email.ValueType;
  }
>;

export const registerImporterCandidatureCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ImporterCandidatureCommand> = async ({
    identifiantProjet,
    ...options
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    return projet.candidature.importer(options);
  };

  mediator.register('Candidature.Command.ImporterCandidature', handler);
};
