import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import * as DépôtCandidature from '../dépôtCandidature.valueType';
import * as InstructionCandidature from '../instructionCandidature.valueType';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../..';

export type ImporterCandidatureCommand = Message<
  'Candidature.Command.ImporterCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dépôtCandidature: DépôtCandidature.ValueType;
    instructionCandidature: InstructionCandidature.ValueType;
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
