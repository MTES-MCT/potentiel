import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';
import { DétailCandidature } from '../détailCandidature.type';

export type ImporterDétailCandidatureCommand = Message<
  'Candidature.Command.ImporterDétailCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    détails: DétailCandidature;
    importéLe: DateTime.ValueType;
  }
>;

export const registerImporterDétailCandidatureCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ImporterDétailCandidatureCommand> = async ({
    identifiantProjet,
    détails,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet, true);
    await projet.initCandidature();

    await projet.candidature.importerDétail(détails);
  };

  mediator.register('Candidature.Command.ImporterDétailCandidature', handler);
};
