import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';
import { DétailCandidature } from '../détailCandidature.type';

export type CorrigerDétailCandidatureCommand = Message<
  'Candidature.Command.CorrigerDétailCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    détail: DétailCandidature;
    corrigéLe: DateTime.ValueType;
    corrigéPar: Email.ValueType;
  }
>;

export const registerCorrigerDétailCandidatureCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<CorrigerDétailCandidatureCommand> = async ({
    identifiantProjet,
    détail,
    corrigéLe,
    corrigéPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet, true);
    await projet.initCandidature();

    await projet.candidature.corrigerDétail({ détail, corrigéLe, corrigéPar });
  };

  mediator.register('Candidature.Command.CorrigerDétailCandidature', handler);
};
