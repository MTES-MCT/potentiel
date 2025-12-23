import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';
import { DétailCandidature } from '../détailCandidature.type';

export type CorrigerDétailCandidatureCommand = Message<
  'Candidature.Command.CorrigerDétailCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    détails: DétailCandidature;
    importéLe: DateTime.ValueType;
  }
>;

export const registerCorrigerDétailCandidatureCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<CorrigerDétailCandidatureCommand> = async ({
    identifiantProjet,
    détails,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet, true);
    await projet.initCandidature();

    await projet.candidature.corrigerDétail(détails);
  };

  mediator.register('Candidature.Command.CorrigerDétailCandidature', handler);
};
