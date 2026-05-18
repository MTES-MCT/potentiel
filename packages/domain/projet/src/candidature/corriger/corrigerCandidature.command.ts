import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port.js';
import type { IdentifiantProjet } from '../../index.js';
import type { Dépôt, DétailCandidature, Instruction } from '../index.js';

export type CorrigerCandidatureCommand = Message<
  'Candidature.Command.CorrigerCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dépôt: Dépôt.ValueType;
    instruction: Instruction.ValueType;
    détail?: DétailCandidature.RawType;
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
    const projet = await getProjetAggregateRoot(identifiantProjet, true);
    await projet.initCandidature();
    return projet.candidature.corriger(options);
  };

  mediator.register('Candidature.Command.CorrigerCandidature', handler);
};
