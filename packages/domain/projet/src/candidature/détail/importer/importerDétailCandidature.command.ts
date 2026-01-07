import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';
import { DétailCandidature } from '../détailCandidature.type';

export type ImporterDétailCandidatureCommand = Message<
  'Candidature.Command.ImporterDétailCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    détail: DétailCandidature;
    importéLe: DateTime.ValueType;
    importéPar: Email.ValueType;
  }
>;

export const registerImporterDétailCandidatureCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ImporterDétailCandidatureCommand> = async ({
    identifiantProjet,
    détail,
    importéLe,
    importéPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet, true);
    await projet.initCandidature();

    await projet.candidature.importerDétail({ détail, importéLe, importéPar });
  };

  mediator.register('Candidature.Command.ImporterDétailCandidature', handler);
};
