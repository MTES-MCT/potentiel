import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../index.js';
import type { Dépôt, DétailCandidature, Instruction } from '../index.js';

export type ImporterCandidatureCommand = Message<
  'Candidature.Command.ImporterCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dépôt: Dépôt.ValueType;
    instruction: Instruction.ValueType;
    détail: DétailCandidature.RawType;

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
    const projet = await getProjetAggregateRoot(identifiantProjet, true);
    await projet.initCandidature();
    return projet.candidature.importer(options);
  };

  mediator.register('Candidature.Command.ImporterCandidature', handler);
};
