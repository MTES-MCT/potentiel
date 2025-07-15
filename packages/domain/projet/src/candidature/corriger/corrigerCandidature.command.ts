import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';
import { Dépôt, Instruction } from '..';
import { IdentifiantProjet } from '../..';

export type CorrigerCandidatureCommand = Message<
  'Candidature.Command.CorrigerCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dépôt: Dépôt.ValueType;
    instruction: Instruction.ValueType;
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
