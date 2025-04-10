import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import * as InstructionCandidature from '../instructionCandidature.valueType';
import * as DépôtCandidature from '../dépôtCandidature.valueType';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../..';

export type CorrigerCandidatureCommand = Message<
  'Candidature.Command.CorrigerCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    instructionCandidature: InstructionCandidature.ValueType;
    dépôtCandidature: DépôtCandidature.ValueType;
    corrigéLe: DateTime.ValueType;
    corrigéPar: Email.ValueType;
    doitRégénérerAttestation?: true;
    détailsMisÀJour?: true;
  }
>;

export const registerCorrigerCandidatureCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<CorrigerCandidatureCommand> = async ({
    identifiantProjet,
    ...options
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    return projet.candidature.corriger(options);
  };

  mediator.register('Candidature.Command.CorrigerCandidature', handler);
};
